
import merge from 'deepmerge';
import {delayedPromise} from "./mock-util";
import {DEFAULT_TYPE_NAME, RESERVED_FIELD_NAMES, EntryRepository} from "./EntryRepository";


/**
 * Make a complete type by merging and / or overriding super type(s).
 * @param type
 * @param typeProvider
 */
export const mergeType = (type, rawTypeProvider) => {

    if (typeof(type) !== 'object') {
        return type;
    }

    if (type.name === DEFAULT_TYPE_NAME) {
        return merge(rawTypeProvider(DEFAULT_TYPE_NAME), {}) || {name: DEFAULT_TYPE_NAME};
    }

    const superName = type.extends || DEFAULT_TYPE_NAME;

    const rawSuperType = rawTypeProvider(superName);
    if (rawSuperType) {
        rawSuperType.name = superName;
    }

    const superType = mergeType(rawSuperType, rawTypeProvider);

    const typeName = type.name;
    const merged = merge(superType, type);
    merged.name = typeName;

    return merged;

};

class AbstractLocalRepository extends EntryRepository {

    constructor(props) {
        super(props);
        this.mockDelay = 300;
    }


    doGetItems() {
        throw new Error("AbstractLocalRepository.doGetItems() is not implemented");
    }
    doGetTypes() {
        throw new Error("AbstractLocalRepository.doGetTypes() is not implemented");
    }
    doGetItem(id) {
        const items = this.doGetItems();
        for (let i = 0; i < items.length; i++) {
            const it = items[i];
            if (it.id === id) {
                // Make sure that we return new objects every time (to mimic actual
                // server response)
                return JSON.parse(JSON.stringify(it));
            }
        }
        return undefined;
    }
    doSaveItem(id) {
        throw new Error("AbstractLocalRepository.doSaveItem() is not implemented");
    }



// _meta: {
//     fields: {
//         detail: {
//             type: {
//                 // contentType here can be used to select one of type's allowed content type values
//                 // If not specified, populated automatically by type default (if specifies one), or
//                 // from the dataType:
//                 //
//                 // dataType   contentType
//                 // ------------------------
//                 // string     "text/plain"
//                 // number     "text/plain"
//                 // others     undefined?
//                 //
//                 dataType: "string",   // READ-ONLY ?
//                 contentType: "text/html"
//             }
//         }
//     }
// }


    updateFieldMeta(item, field, typeProvider) {
        if (typeof(item) === 'undefined' || !field) {
            return;
        }


        const typeName = item.type || DEFAULT_TYPE_NAME;
        const type = typeProvider(typeName);
        if (!type) {
            console.warn("No such type found: " + typeName);
            return;
        }
        const fieldType = type.fields[field];

        if (typeof(item._meta) === 'undefined') {
            item._meta = {};
        }
        const meta = item._meta;
        if (typeof(meta.fields) === 'undefined') {
            meta.fields = {};
        }
        const metaFields = meta.fields;
        if (typeof(metaFields[field]) === 'undefined') {
            metaFields[field] = {};
        }
        const fieldMeta = metaFields[field];
        if (typeof(fieldMeta.type) === 'undefined') {
            fieldMeta.type = {}
        }


        const dataType = fieldType.dataType;
        fieldMeta.type.dataType = dataType;

        if (!fieldMeta.type.contentType) {


            if (fieldType.contentType) {
                fieldMeta.type.contentType = fieldType.contentType;
            } else {
                switch (dataType) {
                    case 'string':
                    case 'number':
                    case 'password':
                        fieldMeta.type.contentType = "text/plain";
                        break;
                    case 'html':
                        fieldMeta.type.contentType = "text/html";
                        break;
                }
            }

        }
    }

    updateAllFieldsMeta(item, typeProvider) {
        if (typeof(item) === 'undefined') {
            return;
        }
        const typeName = item.type || DEFAULT_TYPE_NAME;
        const type = typeProvider(typeName);
        if (!type) {
            console.warn("No such type found: " + typeName);
            return;
        }
        for (let field in type.fields) {
            if (!type.fields.hasOwnProperty(field)) {
                continue;
            }
            this.updateFieldMeta(item, field, typeProvider);
        }
    }

    promise(func) {
        return new Promise((resolve, reject) => {
            try {
                resolve(func());
            } catch (err) {
                reject(err);
            }
        });
    };


    getItems() {
        return this.promise(() => {
            return this.doGetItems();
        });
    }

    getTypes() {
        return this.promise(() => {
            return this.doGetTypes();
        });
    }

    getItem(id) {
        return this.promise(() => {
            return this.doGetItem(id, true);
        });
    }


    _doUpdateItem(itemId, newState) {
        console.log("AbstractLocalRepository._doUpdateItem; itemId = " + itemId + "; newState = " + JSON.stringify(newState));

        const isNew = !itemId;

        const item = isNew ? {type: DEFAULT_TYPE_NAME} : this.doGetItem(itemId);

        if (!item) {
            throw new Error("No Item found with id " + itemId);
        }

        let itemTypeName = item.type || DEFAULT_TYPE_NAME;

        const itemType = this.types[itemTypeName];
        if (!itemType) {
            throw new Error("No such type exists: " + itemType);
        }

        const fieldNames = [];
        for (let fn in itemType.fields) {
            if (itemType.fields.hasOwnProperty(fn)) {
                fieldNames.push(fn);
            }
        }


        const fields = fieldNames;
        let changed = false;

        var reservedFields = new Set(RESERVED_FIELD_NAMES);

        const newMetaFields = newState._meta && newState._meta.fields;
        fields.forEach((field) => {
            // field.type, field.id, field._meta
            if (!reservedFields.has(field)) {


                const newValue = newState[field];
                if (typeof(newValue) !== 'undefined') {
                    const oldValue = item[field];

                    if (oldValue !== newValue) {
                        console.log("Modified '" + field + "': " + oldValue + " --> " + newValue);
                        item[field] = newValue;
                        changed = true;
                    }
                }

                this.updateFieldMeta(item, field, (typeName) => this.types[typeName]);

                // TODO update meta fields, i.e. if contentType of field is changed by the request!

                // if (newMetaFields && newMetaFields[field]) {
                //
                // }
            }

        });

        if (changed) {
            this.doSaveItem(item);
        }

        return {
            id: item.id,
            modified: changed,
            isNew: isNew,
            newState: item
        };
    };


    updateItem(itemId, newState) {
        return this.promise(() => {
            const result = this._doUpdateItem(itemId, newState);
            if (result.isNew) {
                this.fireItemsAddedEvent({itemIds: [result.id], items: [newState]});
            } else if (result.modified) {
                this.fireItemsUpdatedEvent({itemIds: [result.id], items: [newState]});
            }
            return result;
        });
    }
}

export default AbstractLocalRepository;
