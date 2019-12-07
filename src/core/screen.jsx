import _ from 'lodash';
import State from './state';
import {getRequest} from "./request";
import AppEvent from './event';

class ScreenState extends State {
    constructor() {
        super();

        this.config = new State();
        this.event = new AppEvent;
    }

    on(event, callback) {
        return this.event.on(event, callback);
    }

    off(event, callback) {
        return this.event.off(event, callback);
    }

    setConfig(config) {
        this.config.reset(config);
    }

    load(path, isRefresh = false) {
        const curPath = this.get('path');

        if (_.isEqual(curPath, path) && !isRefresh) {
            return; // Keep the current page
        }

        // Trigger before screen change event
        this.event.trigger( 'screenChange' ).then(() => this.getScreen(path));
    }

    getScreen(path) {
        getRequest(path).then( r => this.maybeUpdateState(r, path));
    }

    maybeUpdateState(state, path) {
        state.path = path;

        this.event.trigger('screenChanged').then(() => {
            this.reset(state);
        });
    }
}

const Screen = new ScreenState;

export default Screen;