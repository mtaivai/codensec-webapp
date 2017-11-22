
import merge from 'deepmerge';

import Events from '../Events';

export const DEFAULT_TYPE_NAME = '_default';

export const RESERVED_FIELD_NAMES = ['id', 'type', '_meta'];

const EVENT_ITEMS_ADDED = "items-added";
const EVENT_ITEMS_REMOVED= "items-removed";
const EVENT_ITEMS_UPDATED = "items-updated";


export class EntryRepository {

    constructor(props) {

        // console.log("ITEMS: " + JSON.stringify(this.items, null, 2));

        this.events = new Events();


    }

    addItemsAddedListener(listener) {
        this.events.add(EVENT_ITEMS_ADDED, listener);
    }
    removeItemsAddedListener(listener) {
        this.events.remove(EVENT_ITEMS_ADDED, listener);
    }
    addItemsRemovedListener(listener) {
        this.events.add(EVENT_ITEMS_REMOVED, listener);
    }
    removeItemsRemovedListener(listener) {
        this.events.remove(EVENT_ITEMS_REMOVED, listener);
    }
    addItemsUpdatedListener(listener) {
        this.events.add(EVENT_ITEMS_UPDATED, listener);
    }
    removeItemsUpdatedListener(listener) {
        this.events.remove(EVENT_ITEMS_UPDATED, listener);
    }

    fireItemsAddedEvent(e) {
        this.events.fireEvent({...e, type: EVENT_ITEMS_ADDED});
    }
    fireItemsRemovedEvent(e) {
        this.events.fireEvent({...e, type: EVENT_ITEMS_REMOVED});
    }

    fireItemsUpdatedEvent(e) {
        this.events.fireEvent({...e, type: EVENT_ITEMS_UPDATED});
    }

    getItems() {
        return new Promise((resolve, reject) => {
            reject("EntryRepository.getItems() is not implemented for this repository");
        });
    }


    getTypes() {
        return new Promise((resolve, reject) => {
            reject("EntryRepository.getTypes() is not implemented for this repository");
        });
    }

    getItem(id) {
        return new Promise((resolve, reject) => {
            reject("EntryRepository.getItem() is not implemented for this repository");
        });
    }

    updateItem(itemId, newState) {
        return new Promise((resolve, reject) => {
            reject("EntryRepository.updateItem() is not implemented for this repository");
        });
    }
}

