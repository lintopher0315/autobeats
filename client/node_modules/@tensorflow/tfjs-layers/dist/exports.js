"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var base_callbacks_1 = require("./base_callbacks");
var input_layer_1 = require("./engine/input_layer");
var training_1 = require("./engine/training");
var models_1 = require("./models");
function model(args) {
    return new training_1.Model(args);
}
exports.model = model;
function sequential(config) {
    return new models_1.Sequential(config);
}
exports.sequential = sequential;
function loadModel(pathOrIOHandler, strict) {
    if (strict === void 0) { strict = true; }
    tfjs_core_1.deprecationWarn("tf.loadModel() is deprecated and will be removed in TensorFlow.js " +
        "1.0. Please switch to tf.loadLayersModel().");
    return models_1.loadModelInternal(pathOrIOHandler, { strict: strict });
}
exports.loadModel = loadModel;
function loadLayersModel(pathOrIOHandler, options) {
    if (options == null) {
        options = {};
    }
    return models_1.loadModelInternal(pathOrIOHandler, options);
}
exports.loadLayersModel = loadLayersModel;
function input(config) {
    return input_layer_1.Input(config);
}
exports.input = input;
function registerCallbackConstructor(verbosityLevel, callbackConstructor) {
    base_callbacks_1.CallbackConstructorRegistry.registerCallbackConstructor(verbosityLevel, callbackConstructor);
}
exports.registerCallbackConstructor = registerCallbackConstructor;
//# sourceMappingURL=exports.js.map