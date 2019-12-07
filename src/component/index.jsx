import React from 'react';

let components = {};

export function addComponent(name, compo) {
    if (components[name]) {
        // Don't allow override
        return false;
    }

    components[name] = compo;

    return true;
}

export function hasComponent(name) {
    return !!components[name];
}

export function getComponent(name) {
    if (!hasComponent(name)) {
        return null;
    }

    return components[name];
}

export function renderComponent(name, props = {}, children = null) {
    if (!hasComponent(name)) {
        return null;
    }

    props = props || {};

    const compo = components[name];

    return React.cloneElement(compo, props, children);
}

export function getComponents() {
    return components;
}