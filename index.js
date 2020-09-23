"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSliceP = void 0;
var immer_1 = require("immer");
exports.createSliceP = function (slide) {
    var objectNew = {};
    if (slide.reducers) {
        Object.keys(slide.reducers).forEach(function (key) {
            objectNew[key] = function (payload) { return ({
                type: slide.name + key,
                payload: payload,
                function: slide.reducers[key],
            }); };
        });
    }
    var Reducer = function (state, action) {
        if (state === void 0) { state = slide.initialState; }
        return immer_1.produce(state, function (draft) {
            var functionFeature;
            Object.keys(objectNew).forEach(function (key) {
                functionFeature =
                    action.type === objectNew[key]().type ? objectNew[key]().function : functionFeature;
            });
            return functionFeature ? functionFeature(draft, action.payload) : state;
        });
    };
    return {
        action: __assign({}, objectNew),
        reducer: Reducer,
    };
};
