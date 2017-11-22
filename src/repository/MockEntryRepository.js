
import merge from 'deepmerge';
import {delayedPromise} from "./mock-util";
import {DEFAULT_TYPE_NAME, EntryRepository} from "./EntryRepository";
import AbstractLocalRepository from './AbstractLocalRepository'
import {buildMockTypes} from "./mockTypes";

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


class MockEntryRepository extends AbstractLocalRepository {

    constructor() {
        super();
        this.mockDelay = 10;

        this.types = JSON.parse(JSON.stringify(buildMockTypes()));

        // console.log("TYPES: " + JSON.stringify(this.types, null, 2));

        this.items = [...ITEMS];

        // // Add more items
        // for (let i = 0; i < 3000; i++) {
        //     this.items.push({
        //         type: "Basic",
        //         title: "Generated item " + (i + 1)
        //     });
        // }

        this.nextItemId = 1;
        this.items.forEach((it) => {
            it.id = this.nextItemId++;
            if (!it.type) {
                it.type = "Basic";
            }
            this.updateAllFieldsMeta(it, (typeName) => this.types[typeName]);
        });

        // console.log("ITEMS: " + JSON.stringify(this.items, null, 2));

    }

    promise(func) {
        return delayedPromise(func, this.mockDelay);
    };

    doGetItems() {
        const items = [];

        this.items.forEach((it) => {
            // Make sure that we return new objects every time (to mimic actual
            // server response)
            items.push(JSON.parse(JSON.stringify(it)));
        });
        return items;
    }


    doGetTypes() {
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


    doGetItem(id) {
        const ref = this.doGetItemRef(id);
        if (ref) {
            return JSON.parse(JSON.stringify(ref));
        } else {
            return undefined;
        }
    }

    doGetItemRef(id) {
        const c = this.items.length;
        for (let i = 0; i < c; i++) {
            const it = this.items[i];
            if (it.id === id) {
                // Make sure that we return new objects every time (to mimic actual
                // server response)
                return it;
            }
        }
        return undefined;
    }


    doSaveItem(item) {
        if (!item) {
            return;
        }
        const id = item.id;

        if (id) {
            // Update existing
            let savedItem;
            const c = this.items.length;
            for (let i = 0; i < c; i++) {
                const it = this.items[i];
                if (it.id === id) {
                    savedItem = JSON.parse(JSON.stringify(item));
                    this.items[i] = savedItem;
                    break;
                }
            }
            if (!savedItem) {
                throw new Error("No item with id " + id + " found");
            }
            return JSON.parse(JSON.stringify(savedItem));
        } else {
            // Save new
            const newItem = JSON.parse(JSON.stringify(item));
            newItem.id = this.nextItemId++;
            this.items.push(newItem);
            return JSON.parse(JSON.stringify(newItem));
        }
    }
}

export default MockEntryRepository;