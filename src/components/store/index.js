import * as redux from 'redux';
//====import { applyMiddleware} from "redux";
//==== import { createStateSyncMiddleware, initStateWithPrevTab } from 'redux-state-sync';

const initialState = { auth: undefined, reportData: undefined };
//====== const reduxStateSyncConfig = {};

function authReducer(state = initialState, action) {

    //console.log('In authReducer with action.type: ' + action.type);
    if (action) {
        if (action.type === 'refresh') {
            return {
                auth: action.auth,
            };
        }
        else if (action.type === 'refresh-reportData') {
            return {
                reportData: action.reportData,
            };
        }
    }

    return state;
};

/*function reportDataReducer(state = initialState, action) {

    console.log('In reportDataReducer');
    if (action) {
        console.log('In reportDataReducer with action.type: ' + action.type);
    }

    return state;
};*/

//const store = redux.createStore(authReducer, reportDataReducer);
const store = redux.createStore(authReducer);

/*====== const store = redux.createStore(authReducer, initialState,
    applyMiddleware(createStateSyncMiddleware(reduxStateSyncConfig)));

initStateWithPrevTab(store); ====*/

export function getAuth() {
    return store.getState().auth;
}

export function getReportData() {
    return store.getState().reportData;
}


export default store;