import React from 'react';
import ReactDOM from 'react-dom';
import {Config, Screen} from '@simplifiedjs/ui';

(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('Simplified', function() {
            return factory;
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        root.Simplified = factory;
    }
}(this,
    /**
     *
     * @param {object} config {
     *     @param {string} host
     *     @param {string} protocol
     *     @param {string} hash
     *     @param {string} path
     * }
     * @constructor
     */
    function Simplified(config) {
        Config.set(config, true);

        // Don't change the current UI loader while fetching the app's common data.
        Config.init(config.path);
}));