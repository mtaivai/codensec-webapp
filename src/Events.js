
class Events {
    constructor() {
        this.listeners = {
        };
    }
    add(type, listener) {
        console.log("Events.add: type = " + type + "; listener = " + listener);

        let listeners = this.listeners[type];
        if (typeof(listeners) === 'undefined') {
            listeners = [];
            this.listeners[type] = listeners;
        }


        const i = listeners.indexOf(listener);
        if (i < 0) {
            listeners.push(listener);
            console.log("Did add: " + listener);
        }
    }
    remove(type, listener) {
        console.log("Events.remove: type = " + type + "; listener = " + listener);


        const listeners = this.listeners[type];
        if (!listeners) {
            return;
        }

        const i = listeners.indexOf(listener);
        if (i >= 0) {
            listeners.splice(i, 1);
            console.log("Did remove: " + listener);
        }
    }

    fireEvent(e) {
        const type = e.type;
        if (!type) {
            console.error("Invalid event: no 'type' specified");
            return;
        }
        const listeners = this.listeners[type];
        if (listeners) {
            listeners.forEach((l) => {
                try {
                    l(e);
                } catch (err) {
                    console.warn("Catched an error while dispatching an event", err);
                    throw err;
                }
            });
        }
    }
}
export default Events;
