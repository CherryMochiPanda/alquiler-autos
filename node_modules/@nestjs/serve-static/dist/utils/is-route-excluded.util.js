"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRouteExcluded = void 0;
const path_to_regexp_1 = require("path-to-regexp");
const isRouteExcluded = (req, paths = []) => {
    return paths.some((path) => {
        const { regexp } = (0, path_to_regexp_1.pathToRegexp)(path);
        const queryParamsIndex = req.originalUrl.indexOf('?');
        const pathname = queryParamsIndex >= 0
            ? req.originalUrl.slice(0, queryParamsIndex)
            : req.originalUrl;
        if (!regexp.exec(pathname + '/')) {
            return false;
        }
        return true;
    });
};
exports.isRouteExcluded = isRouteExcluded;
