import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import Screen from '../core/screen';
import Body from "../component/body";

function ScreenLoadingProgress() {
    const [isLoading, changeLoadingStatus] = useState(false);

    const offLoad = () => changeLoadingStatus(false),
        onLoad = () => changeLoadingStatus(true);

    useEffect(() => {
        Screen.on( 'changeScreen', onLoad);
        Screen.on('changedScreen', offLoad);

        return () => {
            Screen.off('changeScreen', onLoad);
            Screen.off('changedScreen', offLoad);
        }
    });

    return null;
}

export default function ViewScreen(config) {
    return [
        <ScreenLoadingProgress key={_.uniqueId()}/>,
        <Body key={_.uniqueId()}/>
    ];
}