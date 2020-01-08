import State from './state';
import {getRequest} from "./request";

class ConfigState extends State {
    init(path) {
        return getRequest(path).then(r => this.updateState(r));
    }

    updateState(res) {
        this.reset(res);

        return this.state;
    }
}

const Config = new ConfigState();

export default Config;