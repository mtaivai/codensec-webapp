
import AbstractLocalRepository from "./AbstractLocalRepository";
import {buildMockTypes} from "./mockTypes";


class LocalStorageEntryRepository extends AbstractLocalRepository {

    constructor(props) {
        super(props);
        this.types = buildMockTypes();

        // this.storage = localStorage;
        this.storage = sessionStorage;
    }

    doGetItems() {

        let storeItems;
        const storeItemsJson = this.storage.getItem("items");
        if (storeItemsJson) {
            storeItems = JSON.parse(storeItemsJson);
        } else {
            storeItems = [
            ];
        }
        return storeItems;
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

    _nextItemId() {
        let nextItemId = this.storage.getItem("nextItemId");
        if (!nextItemId) {
            nextItemId = 1;
        } else {
            nextItemId = parseInt(nextItemId) + 1;
        }
        this.storage.setItem("nextItemId", nextItemId);
        return nextItemId;
    }
    doSaveItem(item) {
        if (!item) {
            return;
        }
        const id = item.id;

        let savedItem;
        const items = this.doGetItems();

        if (id) {
            // Update existing
            const c = items.length;
            for (let i = 0; i < c; i++) {
                const it = items[i];
                if (it.id === id) {
                    savedItem = item;
                    items[i] = savedItem;
                    break;
                }
            }
            if (!savedItem) {
                throw new Error("No item with id " + id + " found");
            }

        } else {
            // Save new
            item.id = this._nextItemId();

            items.push(item);
            savedItem = item;
        }

        this.storage.setItem("items", JSON.stringify(items));

        return savedItem;
    }



}

export default LocalStorageEntryRepository;