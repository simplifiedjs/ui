import axios from 'axios';
import _ from 'lodash';

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, */*;q=0.1'
};

function instance(options) {
    let {headers} = options;
    headers = headers || {};
    options.headers = _.extend({}, DEFAULT_HEADERS, headers);

    return axios.create(options);
}

function handleCancel(onCancel) {
    return new axios.CancelToken(onCancel);
}

function handleResponse(response) {
    let {data} = response;

    return data;
}

function handleError(err) {
    return [err];
}

export function getRequest(url, params = {}, headers = false, onCancel = false) {
    params = params || {};

    let inst = instance({headers}),
        CancelToken = onCancel ? handleCancel(onCancel) : false;

    return inst.get(url, {params, CancelToken}).then(handleResponse).catch(handleError);
}

export function postRequest(url, params, headers = false, onCancel = false) {
    params = params || {};

    let inst = instance({headers}),
        CancelToken = onCancel ? handleCancel(onCancel) : false;

    return inst.post(url, params, {CancelToken}).then(handleResponse).catch(handleError);
}

export function uploadFile(url, params, headers = false, onCancel = false) {
    headers = headers || {};

    // Change content-type
    headers['Content-Type'] = 'multipart/form-data; boundary=' + (new Date()).getTime();

    return postRequest(url, params, headers, onCancel);
}