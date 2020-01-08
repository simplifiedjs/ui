import _ from 'lodash';

export default class State {
    constructor(defaultState = {}, subscribers = []) {
        this.state = defaultState || {};
        this.subscribers = subscribers || [];
    }

    /**
     * Returns the entire state object if name is omitted or the value of the given name.
     *
     * @param {string} name
     * @returns {*}
     */
    get(name) {
        if (!name) {
            // Return all state
            return this.state;
        }

        return this.state[name];
    }

    /**
     * Sets or update a state.
     *
     * @param {string|object} name
     * @param {*} value
     * @param {boolean} isSilent
     */
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

    /**
     * Removes a state.
     *
     * @param {string} name
     * @param {boolean} isSilent
     */
    unset(name, isSilent = false) {
        if (!this.state[name]) {
            return;
        }

        let oldState = _.extend({}, this.state);

        this.state = _.omit(this.state, name);

        if (!isSilent) {
            return;
        }

        // Call subscribers
        this.__callSubscribers(oldState);
    }

    /**
     * Change the state object into a new one.
     *
     * @param {object} state
     * @param {boolean} isSilent
     */
    reset(state, isSilent = false) {
        let oldState = _.extend({}, this.state);

        this.state = state;

        if (!isSilent) {
            return;
        }

        this.__callSubscribers(oldState);
    }

    /**
     * Adds a callable function which gets executed whenever a state is changed.
     *
     * @param {function} subscriber
     * @returns {boolean}
     */
    subscribe(subscriber) {
        if ('function' !== typeof subscriber || !subscriber.name) {
            // Don't accept unnamed subscriber callback
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

    /**
     * Removes a callable function listener.
     *
     * @param {function} callback
     */
    unsubscribe(callback) {
        let subscribers = this.subscribers,
            index = _.indexOf(subscribers, callback);

        if (index < 0) {
            return;
        }

        subscribers = _.without(subscribers, callback);
        this.subscribers = subscribers;
    }

    /**
     * Calls and execute all listeners.
     *
     * @param {object} oldState
     * @private
     */
    __callSubscribers(oldState) {
        let state = _.extend({}, this.state);

        _.map( this.subscribers, cb => cb.call(null, state, oldState, this));
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
     * Get the value of the next property of the given state name.
     *
     * @param {string} name
     */
    nextOf(name) {
        name = name.toString();

        let keys = this.getKeys(),
            index = _.findIndex(keys, name);

        if (index < 0 || !keys[index+1]) {
            return null;
        }

        return this.get(keys[index+1]);
    }

    /**
     * Get the value of the previous property of the given state name.
     *
     * @param {string} name
     */
    prevOf(name) {
        name = name.toString();

        let keys = this.getKeys(),
            index = _.findIndex(keys, name);

        if (index <= 0 || !keys[index-1]) {
            return null;
        }

        return this.get(keys[index-1]);
    }

    /**
     * Returns a state as a plain object.
     *
     * @returns {object}
     */
    toJSON() {
        const json = obj => {
            obj = _.extend({}, obj);

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