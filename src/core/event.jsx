import _ from 'lodash';

export default class AppEvent {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        let events = this.events[event] || [],
            index = _.indexOf(events, callback);

        if (!callback.name || index >= 0) {
            return; // Bail if unknown callback or if the given callback already exist
        }

        events.push(callback);

        this.events[event] = events;
    }

    off(event, callback) {
        let events = this.events[event];

        if (!events || !callback.name) {
            return;
        }

        let index = _.indexOf(events, callback);

        if (index < 0) {
            return;
        }

        events = _.without(events, callback);

        this.events[event] = events;
    }

    trigger(event, value) {
        let events = this.events[name];

        if (!events) {
            return Promise.resolve(value);
        }

        let args = _.values(arguments).slice(1);

       return events.reduce( (promise, cb) => promise.then( r => cb.apply(null, r)), Promise.resolve(args));
    }
}