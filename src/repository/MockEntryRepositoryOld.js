
import merge from 'deepmerge';
import {delayedPromise} from "./mock-util";
import {DEFAULT_TYPE_NAME, EntryRepository} from "./EntryRepository";


const fieldType = (dataType, props) => {
    let type;
    if (typeof(dataType) === 'object') {
        type = dataType;
    } else {
        type = {
            dataType: dataType,
            ...props
        };
    }

    // data types
    // - string
    // - number
    // - boolean

    return type;
};

const TYPES = {
    [DEFAULT_TYPE_NAME]: {
        fields: {
            title: fieldType('string', {required: true, label: 'Title'}),
            tags: fieldType('tag', {required: false, collection: 'set', minOccurrences: 0, maxOccurrences: -1})
        }
    },
    "Basic": {
        fields: {
            detail: fieldType('string', {required: false, contentType: 'text/html', maxLength: 32768})
        }
    },
    "Note": {
        extends: "Basic",
        fields: {
            title: fieldType({expression: "${detail!substring:0:40!plaintext}"})
        }
    },
    "SimpleHostEntry": {
        extends: "Basic",
        title: "Computer password",
        groups: [
            {

            }
        ],
        fields: {
            //title: "generated('{userName}@{hostName}')",
            hostName: fieldType('string', {required: true}),
            userName: fieldType('string', {required: true}),
            foobar: fieldType('password', {required: true}),

            password: fieldType('password', {required: false, maxLength: 1024})
        }
    }
};

const ITEMS = [
    {
        type: "Note",
        detail: "<b>Lorem ipsum</b> dolor sit amet, consectetur adipiscing elit. In non molestie libero. Quisque sagittis nisl" +
        " libero, non fringilla odio auctor id. Integer feugiat sodales felis eget sollicitudin. Etiam sodales sodales" +
        " nisi vitae pharetra. Ut luctus dapibus dolor, eget mollis nisi pharetra a. Maecenas ut varius odio, in" +
        " ultricies ligula. Suspendisse purus magna, vestibulum eget tempus id, porta quis nisi. Proin egestas" +
        " vestibulum est ut gravida. Integer interdum laoreet erat in vestibulum. Morbi nec consequat erat. Aliquam" +
        " mattis iaculis porttitor.\n" +
        "\n" +
        "Suspendisse eget mauris ut urna ultricies porttitor et in nisl. Curabitur eget ultricies est. Nullam rhoncus " +
        "ultrices ex, eu viverra metus placerat et. Mauris sollicitudin laoreet vestibulum. Vestibulum sollicitudin lacus " +
        "faucibus efficitur semper. Nunc interdum tristique mauris a dictum. Pellentesque aliquet arcu ut mi consequat molestie.",
        _meta: {
            fields: {
                detail: {
                    type: {
                        // contentType here can be used to select one of type's allowed content type values
                        // If not specified, populated automatically by type default (if specifies one), or
                        // from the dataType:
                        //
                        // dataType   contentType
                        // ------------------------
                        // string     "text/plain"
                        // number     "text/plain"
                        // others     undefined?
                        //
                        contentType: "text/html"
                    }
                }
            }
        }
    },
    {
        title: "Example Server 1",
        type: "SimpleHostEntry",
        tags: ["Example", "John Doe"],
        hostName: "srv1.example.com",
        userName: "johndoe1",
        password: "secret",
        detail: "Example entry 1"
    },
    {
        title: "Example Server 2",
        detail: "<script type='text/javascript'>alert('foo');</script>"
    },
    {
        title: "Example Server 3",
        detail: "john.doe@example.com"
    },
    {
        title: "Example Server 4",
        detail: "john.doe@example.com"
    },
];

/**
 * Make a complete type by merging and / or overriding super type(s).
 * @param type
 * @param typeProvider
 */
const mergeType = (type, rawTypeProvider) => {

    if (typeof(type) !== 'object') {
        return type;
    }

    if (type.name === DEFAULT_TYPE_NAME) {
        return rawTypeProvider(DEFAULT_TYPE_NAME) || {name: DEFAULT_TYPE_NAME};
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


const updateFieldMeta = (item, field, typeProvider) => {
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

};


const updateAllFieldsMeta = (item, typeProvider) => {
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
        updateFieldMeta(item, field, typeProvider);
    }

};

class MockEntryRepositoryOld extends EntryRepository {

    constructor() {
        super();
        this.mockDelay = 300;



        this.types = {};
        for (let typeName in TYPES) {
            if (!TYPES.hasOwnProperty(typeName)) {
                continue;
            }

            const type = TYPES[typeName];
            type.name = typeName;
            const merged = mergeType(type, (name) => TYPES[name]);
            this.types[typeName] = merged;
        }

        // console.log("TYPES: " + JSON.stringify(this.types, null, 2));

        this.items = [...ITEMS];
        let nextId = 1;
        this.items.forEach((it) => {
            it.id = nextId++;
            if (!it.type) {
                it.type = "Basic";
            }
            updateAllFieldsMeta(it, (typeName) => this.types[typeName]);
        });

        // console.log("ITEMS: " + JSON.stringify(this.items, null, 2));

    }

    _doGetItems() {
        const items = [];

        this.items.forEach((it) => {
            // Make sure that we return new objects every time (to mimic actual
            // server response)
            items.push(JSON.parse(JSON.stringify(it)));
        });
        return items;
    }
    getItems() {

        return delayedPromise(() => {
            return this._doGetItems();
        }, this.mockDelay);
    }

    _doGetTypes() {
        const types = [];
        for (let typeName in this.types) {
            if (!this.types.hasOwnProperty(typeName)) {
                continue;
            }
            const type = this.types[typeName];

            // Make sure that we return new objects every time (to mimic actual
            // server response)
            types.push(JSON.parse(JSON.stringify(type)));
        }
        return types;
    }
    getTypes() {

        return delayedPromise(() => {
            return this._doGetTypes();
        }, this.mockDelay);
    }

    _doGetItem(id, clone = true) {
        const c = this.items.length;
        for (let i = 0; i < c; i++) {
            const it = this.items[i];
            if (it.id === id) {
                // Make sure that we return new objects every time (to mimic actual
                // server response)
                return clone ? JSON.parse(JSON.stringify(it)) : it;
            }
        }
        return undefined;
    }
    getItem(id) {
        return delayedPromise(() => {
            return this._doGetItem(id, true);
        }, this.mockDelay);
    }

    _doUpdateItem(itemId, newState) {
        console.log("EntryRepository._doUpdateItem; itemId = " + itemId + "; newState = " + JSON.stringify(newState));

        const item = this._doGetItem(itemId, false);
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


        const fields = fieldNames;//['title', 'detail', 'password'];
        let changed = false;

        const newMetaFields = newState._meta && newState._meta.fields;
        fields.forEach((field) => {
            const newValue = newState[field];
            if (typeof(newValue) !== 'undefined') {
                const oldValue = item[field];

                if (oldValue !== newValue) {
                    console.log("Modified '" + field + "': " + oldValue + " --> " + newValue);
                    item[field] = newValue;
                    changed = true;
                }
            }

            updateFieldMeta(item, field, (typeName) => this.types[typeName]);


            // if (newMetaFields && newMetaFields[field]) {
            //
            // }

        });

        return {
            id: itemId,
            modified: changed,
            newState: JSON.parse(JSON.stringify(item))
        };
    };


    updateItem(itemId, newState) {
        return delayedPromise(() => {
            return this._doUpdateItem(itemId, newState);
        }, this.mockDelay);
    }
}

export default MockEntryRepositoryOld;