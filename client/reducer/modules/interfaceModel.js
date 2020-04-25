// Actions
import axios from "axios";

const INIT_MODEL_DATA = 'yapi/model/INIT_MODEL_DATA';
const FETCH_MODEL_LIST_DATA = 'yapi/model/FETCH_MODEL_CAT_LIST_MENU';
const FETCH_MODEL_CAT_LIST_MENU = 'yapi/model/FETCH_MODEL_LIST_MENU';

// Reducer
const initialState = {
    catList: [],
    modelList: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case INIT_MODEL_DATA:
            return initialState;
        case FETCH_MODEL_LIST_DATA:
            return {
                ...state,
                catList: action.data.map(cat => {
                    return {
                        ...cat,
                        list: cat.list || []
                    }
                })
            }
        case FETCH_MODEL_CAT_LIST_MENU:
            return {
                ...state,
                modelList: action.data
            }
        default:
            return state;
    }
};

export const request = (config) => {
    return axios.request(config).then(res => {
        return res.data;
    }).then(data => {
        if(data.errcode === 0) {
            return data.data;
        }
        return Promise.reject(data);
    })
}

export const get = (url, param, headers) => {
    let paramStr = url + "?"
    if (param) {
        for (let key in param) {
            paramStr += `${key}=${param[key]}&`
        }
    }
    paramStr = paramStr.substring(0, paramStr.length - 1)
    return request({
        url: paramStr,
        headers,
        method: "get"
    })
}
export const post = (url, data, headers) => {
    return request({
        url,
        headers,
        method: "post",
        data
    })
}
export const put = (url, data, headers) => {
    return request({
        url,
        headers,
        method: "put",
        data
    })
}

export const restDelete = (url, data, headers) => {
    return request({
        url,
        headers,
        method: "delete",
        data
    })
}

export const postJson = (url, data, headers = {}) => {
    return request({
        url,
        headers: {
            ...headers,
            "Content-type": "application/json"
        },
        method: "post",
        data
    })
}

export const flagPromise = async function (fetchPromise, flag) {
    if (flag) {
        this.setState({
            ...this.state.flag,
            [flag]: true
        })
    }
    return fetchPromise.then(r => r).finally(() => {
        if (flag) {
            this.setState({
                ...this.state.flag,
                [flag]: false
            })
        }
    })
}


export function initInterfaceModel() {
    return {
        type: INIT_MODEL_DATA
    };
}


export async function fetchInterfaceModelList(data) {
    return {
        type: FETCH_MODEL_LIST_DATA,
        data: await get('/api/interface-model/list', data)
    };
}


export async function fetchInterfaceModelCatList(project_id) {
    return {
        type: FETCH_MODEL_LIST_DATA,
        data: await get('/api/interface-model/modelCatList', { project_id })
    };
}

export function delCat(catId, catName, project_id) {
    return postJson('/api/interface-model/delCat', {catId, catName, project_id});
}

export function saveInterfaceModel(model) {
    return postJson('/api/interface-model/saveInterfaceModel', model);
}

/**
 * modelId,
 * modelName
 * interfaceId,
 * updateStrategy: 'always','chooseUpdate',
 * project_id,
 * interfaceName
 * */
export function updateInterface(data) {
    return postJson('/api/interface-model/updateInterface', data);
}

/**
 * modelId,
 * cascadeDelete,
 * catId
 * project_id
 * */
export function deleteModel(data) {
    return postJson('/api/interface-model/deleteModel', data);
}

export function detail(modelId) {
    return get('/api/interface-model/detail', {modelId});
}

/**
 * page,
 * size,
 * projectId
 * catId
 * keyword
 * */
export function list(data) {
    return get('/api/interface-model/list', data);
}

