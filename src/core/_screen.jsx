import _ from 'lodash';
import State from './state';
import AppEvent from "./event";
import Config from './config';
import {getRequest} from "./request";

const evs = new AppEvent();

class Screen extends State {
    constructor() {
        super();
    }

    init(currentPath) {
        // Get the app's config data
        getRequest(currentPath).then( r => this.__updateConfig(r, currentPath) );
    }

    __updateConfig(res, currentPath) {
        Config.reset(res);

        this.load(currentPath);
    }

    on(event, callback) {
        return evs.on(event, callback);
    }

    off(event, callback) {
        return evs.off(event, callback);
    }

    load(path, refresh = false) {}
}