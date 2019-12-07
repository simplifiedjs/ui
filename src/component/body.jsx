import React, {useState, useEffect} from 'react';
import Screen from "../core/screen";
import {renderComponent} from "./index";

export default function Body(defaultState) {
    const [state, updateState] = useState(defaultState);

    const changeTemplate = newState => updateState(newState);

    useEffect(() => {
        Screen.subscribe(changeTemplate);

        return () => Screen.unsubscribe(changeTemplate);
    });

    let {component} = state;

    if (!component) {
        return null;
    }

    return renderComponent(component, state);
}