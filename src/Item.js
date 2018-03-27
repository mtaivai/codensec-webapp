
export const getItemId = (item) => { if (item) return item.id; };
export const getItemVersion = (item) => { if (item) return item.version; };
export const getItemType = (item) => { if (item) return item.type; };
export const getItemMeta = (item) => { if (item) return item._meta; };

export const getItemMetaFields = (item) => {
    const meta = getItemMeta(item);
    if (meta) {
        return meta.fields;
    }
};

export const getItemMetaField = (item, field) => {
    const fields = getItemMetaFields(item);
    if (fields) {
        return fields[field];
    }
};

export const getItemMetaFieldType = (item, field) => {
    const fieldType = getItemMetaField(item, field);
    if (fieldType) {
        return fieldType.type;
    }
};

export const getItemMetaFieldTypeProperty = (item, field, property) => {
    const fieldType = getItemMetaFieldType(item, field);
    if (fieldType) {
        return fieldType[property];
    }
};


export const getItemMetaFieldTypeDataType = (item, field) => {
    return getItemMetaFieldTypeProperty(item, field, 'dataType');
};

export const getItemMetaFieldTypeContentType = (item, field) => {
    return getItemMetaFieldTypeProperty(item, field, 'contentType');
};

export class Item {
    static getId(item) {
        return getItemId(item);
    }
    static getVersion(item) {
        return getItemVersion(item);
    }
    static getType(item) {
        return getItemType(item);
    }
    static getMeta(item) {
        return getItemMeta(item)
    }

    static getFieldDataType(item, field) {
        return getItemMetaFieldTypeDataType(item, field);
    }
    static getFieldContentType(item, field) {
        return getItemMetaFieldTypeContentType(item, field);
    }
}

// Items are currently pure javascript objects without custom methods
//
// class ItemWrapper {
//     constructor(item) {
//         this.item = obj;
//
//     }
//     getId() {
//         return this.item.id;
//     }
//     getVersion() {
//         return this.item.version;
//     }
//     getType() {
//         return this.item.version;
//     }
//     getMeta() {
//         return this.item._meta;
//     }
//     // id
//     // version
//     // type
//
// }


export default Item;
