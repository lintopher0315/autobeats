"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tfjs_core_1 = require("@tensorflow/tfjs-core");
var frozen_model_1 = require("./executor/frozen_model");
var frozen_model_json_1 = require("./executor/frozen_model_json");
var frozen_model_2 = require("./executor/frozen_model");
exports.FrozenModel = frozen_model_2.FrozenModel;
exports.loadTfHubModule = frozen_model_2.loadTfHubModule;
var frozen_model_3 = require("./executor/frozen_model");
exports.GraphModel = frozen_model_3.FrozenModel;
var frozen_model_json_2 = require("./executor/frozen_model_json");
exports.FrozenModelJSON = frozen_model_json_2.FrozenModel;
var version_1 = require("./version");
exports.version_converter = version_1.version;
function loadFrozenModel(modelUrl, weightsManifestUrl, requestOption, onProgress) {
    tfjs_core_1.deprecationWarn('tf.loadFrozenModel() is going away. ' +
        'Use tf.loadGraphModel() instead, and note the positional argument changes.');
    if (modelUrl && modelUrl.endsWith('.json')) {
        return frozen_model_json_1.loadFrozenModel(modelUrl, requestOption, onProgress);
    }
    if (modelUrl != null && weightsManifestUrl == null) {
        weightsManifestUrl = getWeightsManifestUrl(modelUrl);
    }
    return frozen_model_1.loadFrozenModel(modelUrl, weightsManifestUrl, requestOption, onProgress);
}
exports.loadFrozenModel = loadFrozenModel;
function getWeightsManifestUrl(modelUrl) {
    var weightsManifestUrl;
    if (modelUrl != null) {
        var path = modelUrl.substr(0, modelUrl.lastIndexOf('/'));
        weightsManifestUrl = path + '/' + frozen_model_1.DEFAULT_MANIFEST_NAME;
    }
    return weightsManifestUrl;
}
function loadGraphModel(modelUrl, options) {
    if (options === void 0) { options = {}; }
    if (options == null) {
        options = {};
    }
    if (options.fromTFHub) {
        return frozen_model_1.loadTfHubModule(modelUrl, options.requestInit, options.onProgress);
    }
    var weightsManifestUrl = undefined;
    if (modelUrl && modelUrl.endsWith('.json')) {
        return frozen_model_json_1.loadFrozenModel(modelUrl, options.requestInit, options.onProgress);
    }
    if (modelUrl != null && weightsManifestUrl == null) {
        weightsManifestUrl = getWeightsManifestUrl(modelUrl);
    }
    return frozen_model_1.loadFrozenModel(modelUrl, weightsManifestUrl, options.requestInit, options.onProgress);
}
exports.loadGraphModel = loadGraphModel;
//# sourceMappingURL=index.js.map