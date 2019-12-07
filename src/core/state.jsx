import _ from 'lodash';

export default class State {
    constructor(defaultState = {}, subscribers = []) {
        this.state = defaultState || {};
        this.subscribers = subscribers || [];
    }

    get(name) {
        if (!name) {
            // Return all state
            return this.state;
        }

        return this.state[name];
    }

    set(name, value, isSilent = false) {
        let oldState = _.extend({}, this.state);

        if (_.isObject(name)) {
            // Merge object into state
            _.extend(this.state, name);
        } else {
            this.state[name] = value;
        }

        if (isSilent) {
            return; // Do nothing
        }

        this.__callSubscribers(oldState);
    }

    unset(name, isSilent = false) {
        if (!this.state[name]) {
            return;
        }

        let oldState = _.extend({}, this.state);

        this.state = _.omit(this.state, name);

        // Call subscribers
        this.__callSubscribers(oldState);
    }

    reset(state, isSilent = false) {
        let oldState = _.extend({}, this.state);

        this.state = state;

        if (!isSilent) {
            return;
        }

        this.__callSubscribers(oldState);
    }

    subscriber(subscriber) {
        if ('function' !== typeof subscriber || !subscriber.name) {
            // Don't accept unnamed subscriber
            return false;
        }

        let index = _.indexOf( this.subscribers, subscriber );

        if (index >= 0) {
            // Already subscribe, bail!
            return false;
        }

        this.subscribers.push(subscriber);

        return true;
    }

    unsubscribe(callback) {
        let subscribers = this.subscribers,
            index = _.indexOf(subscribers, callback);

        if (index < 0) {
            return;
        }

        subscribers = _.without(subscribers, callback);
        this.subscribers = subscribers;
    }

    __callSubscribers(oldState) {
        _.map( this.subscribers, cb => cb.call(null, this.state, oldState, this));
    }

    getKeys() {
        return _.keys(this.state);
    }

    getValues() {
        return _.values(this.state);
    }

    count() {
        return this.getKeys().length;
    }

    /**
     * Get the next property
     *
     * @param {string} name
     */
    nextOf(name) {
        name = new String(name);

        let keys = this.getKeys(),
            index = _.findIndex(keys, name);

        if (index < 0 || !keys[index+1]) {
            return null;
        }

        return this.get(keys[index+1]);
    }

    /**
     * Get the previous property.
     *
     * @param {string} name
     */
    prevOf(name) {
        name = new String(name);

        let keys = this.getKeys(),
            index = _.findIndex(keys, name);

        if (index <= 0 || !keys[index-1]) {
            return null;
        }

        return this.get(keys[index-1]);
    }

    /**
     * Returns the an state object. Removing any other instance of state.
     *
     * @returns {object}
     */
    toJSON() {
        const json = obj => {
            obj = _.clone(obj);

            Object.keys(obj).map( key => {
                let value = obj[key];

                // If a value is an `state` object, get the state only
                if (value && value.subscribe) {
                    value = value.toJSON();
                }

                obj[key] = value;
            });

            return obj;
        };

        return json(this.state);
    }
}