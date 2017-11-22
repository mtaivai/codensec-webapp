
import Events from './Events';


import MockEntryRepository from './repository/MockEntryRepository';
import LocalStorageEntryRepository from './repository/LocalStorageEntryRepository';

const EVENT_SELECTION_CHANGED = 'selection-changed';
const EVENT_ITEMS_UPDATED = 'items-updated';
const EVENT_ITEMS_ADDED = 'items-added';
const EVENT_COMMAND = 'command';


class EntryController {

    constructor() {
        this.selectedIds = new Set();
        this.events = new Events();
        this.repository = new MockEntryRepository();


        this.onRepositoryItemsAdded = this.onRepositoryItemsAdded.bind(this);
        this.onRepositoryItemsUpdated = this.onRepositoryItemsUpdated.bind(this);

        this.repository.addItemsAddedListener(this.onRepositoryItemsAdded);
        this.repository.addItemsUpdatedListener(this.onRepositoryItemsUpdated);

    }

    addSelectionChangedListener(l) {
        this.events.add(EVENT_SELECTION_CHANGED, l);
    }
    removeSelectionChangedListener(l) {
        this.events.remove(EVENT_SELECTION_CHANGED, l);
    }
    addItemsUpdatedListener(l) {
        this.events.add(EVENT_ITEMS_UPDATED, l);
    }
    removeItemsUpdatedListener(l) {
        this.events.remove(EVENT_ITEMS_UPDATED, l);
    }
    addItemsAddedListener(l) {
        this.events.add(EVENT_ITEMS_ADDED, l);
    }
    removeItemsAddedListener(l) {
        this.events.remove(EVENT_ITEMS_ADDED, l);
    }
    addCommandListener(l) {
        this.events.add(EVENT_COMMAND, l);
    }
    removeCommandListener(l) {
        this.events.remove(EVENT_COMMAND, l);
    }

    onRepositoryItemsAdded(e) {
        console.log("EntryController.onRepositoryItemsAdded: " + JSON.stringify(e));
        this.events.fireEvent({
            type: EVENT_ITEMS_ADDED,
            itemIds: e.itemIds,
            items: e.items
        });
    }
    onRepositoryItemsUpdated(e) {
        console.log("EntryController.onRepositoryItemsUpdated: " + JSON.stringify(e));
        this.events.fireEvent({
            type: EVENT_ITEMS_UPDATED,
            itemIds: e.itemIds,
            items: e.items
        });
    }

    getType(name) {
        return new Promise((resolve, reject) => {
            this.getTypes()
                .then((types) => {
                    let resolvedType;
                    for (let i = 0; i < types.length; i++) {
                        const type = types[i];
                        if (type.name === name) {
                            resolvedType = type;
                            break;
                        }
                    }
                    resolve(resolvedType);
                })
                .catch((err) => {reject(err)});

        });
    }

    getTypes() {
        if (this._cachedTypes) {
            return new Promise((resolve) => {
                resolve(JSON.parse(JSON.stringify(this._cachedTypes)));
            });
        }
        return this.repository.getTypes()
            .then((types) => {
                this._cachedTypes = types;
                return types;
            })
            .catch((err) => {
                console.error("Failed to fetch items", err);
                return err;
            });
    }


    getItems() {
        return this.repository.getItems().catch((err) => {
            console.error("Failed to fetch items", err);
            return err;
        })
    }

    getItem(id) {
        // const c = this.items.length;
        // for (let i = 0; i < c; i++) {
        //     const it = this.items[i];
        //     if (it.id === id) {
        //         return it;
        //     }
        // }
        // return undefined;
        throw new Error("NOTIMPL");
    }
    getSelectedItems() {

        // TODO we should have cache?
        const promise = new Promise((resolve, reject) => {
            // TODO should add filter by id!
            this.repository.getItems().then((items) => {
                const selected = [];
                items.forEach((it) => {
                    if (this.isItemSelected(it)) {
                        selected.push(it);
                    }
                });
                resolve(selected);
            }).catch((error) => {
                reject(error);
            });
        });


        return promise;
        // const selected = [];
        // this.items.forEach((it) => {
        //     if (it.selected) {
        //         selected.push(it);
        //     }
        // });
        // return selected;
    }

    isItemSelected(item) {
        return item && this.selectedIds.has(item.id);
    }

    toggleItemSelected(item, multi) {
        if (!item) {
            return;
        }
        console.log("EntryController.toggleItemSelected", item, multi);

        const prevSelected = [...this.selectedIds];
        const wasSelected = this.selectedIds.has(item.id);


        let prevSelCount = 0;
        if (!multi) {
            prevSelCount = this.selectedIds.size;
            this.selectedIds.clear();
        }
        if ((prevSelCount > 1) || !wasSelected || (wasSelected && !multi)) {
            this.selectedIds.add(item.id);
        } else {
            this.selectedIds.delete(item.id);
        }

        this.events.fireEvent({
            type: EVENT_SELECTION_CHANGED,
            previousSelectedIds: prevSelected,
            newSelectedIds: [...this.selectedIds]
        });
    }

    addItem() {
        console.log("EntryController.addItem");
        // 1. Add new empty item
        const newItem = {type: "_default"};
        this.events.fireEvent({type: EVENT_COMMAND, command: 'edit-item', item: newItem});
    }

    updateItem(itemId, newState) {
        console.log("EntryController.updateItem; itemId = " + itemId + "; newState = " + JSON.stringify(newState));

        return new Promise((resolve, reject) => {
            this.repository.updateItem(itemId, newState).then((result) => {

                // {
                //     id: itemId,
                //         modified: changed,
                //     newState: item
                // };

                resolve(result);

                // TODO don't fire the event from here; instead forward a corresponding event from the repository!
                // if (result.modified) {
                //     this.events.fireEvent({
                //         type: EVENT_ITEMS_UPDATED,
                //         item: result.newState
                //     });
                // }
            }).catch((error) => {
                reject(error);
            });
        });
    };


}

export default EntryController;
