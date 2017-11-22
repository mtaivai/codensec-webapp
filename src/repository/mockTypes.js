
import {DEFAULT_TYPE_NAME} from "./EntryRepository";
import {mergeType} from "./AbstractLocalRepository";

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

export const buildMockTypes = () => {
    const types = {};
    for (let typeName in TYPES) {
        if (!TYPES.hasOwnProperty(typeName)) {
            continue;
        }

        const type = TYPES[typeName];
        type.name = typeName;
        const merged = mergeType(type, (name) => TYPES[name]);
        types[typeName] = merged;
    }
    return types;
};
