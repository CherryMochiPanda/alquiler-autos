"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressLoader = void 0;
const common_1 = require("@nestjs/common");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const fs = __importStar(require("fs"));
const serve_static_constants_1 = require("../serve-static.constants");
const is_route_excluded_util_1 = require("../utils/is-route-excluded.util");
const validate_global_prefix_util_1 = require("../utils/validate-global-prefix.util");
const validate_path_util_1 = require("../utils/validate-path.util");
const abstract_loader_1 = require("./abstract.loader");
let ExpressLoader = class ExpressLoader extends abstract_loader_1.AbstractLoader {
    register(httpAdapter, config, optionsArr) {
        const app = httpAdapter.getInstance();
        const globalPrefix = config.getGlobalPrefix();
        const express = (0, load_package_util_1.loadPackage)('express', 'ServeStaticModule', () => require('express'));
        optionsArr.forEach((options) => {
            options.renderPath = options.renderPath ?? serve_static_constants_1.DEFAULT_EXPRESS_RENDER_PATH;
            const clientPath = options.rootPath ?? serve_static_constants_1.DEFAULT_ROOT_PATH;
            const indexFilePath = this.getIndexFilePath(clientPath);
            const renderFn = (req, res, next) => {
                if (!(0, is_route_excluded_util_1.isRouteExcluded)(req, options.exclude)) {
                    if (options.serveStaticOptions?.setHeaders) {
                        const stat = fs.statSync(indexFilePath);
                        options.serveStaticOptions.setHeaders(res, indexFilePath, stat);
                    }
                    res.sendFile(indexFilePath, null, (err) => {
                        if (err) {
                            const error = new common_1.NotFoundException(err.message);
                            res.status(error.getStatus()).send(error.getResponse());
                        }
                    });
                }
                else {
                    next();
                }
            };
            if (globalPrefix &&
                options.useGlobalPrefix &&
                (0, validate_global_prefix_util_1.validateGlobalPrefix)(globalPrefix)) {
                options.serveRoot = `/${globalPrefix}${options.serveRoot || ''}`;
            }
            if (options.serveRoot) {
                app.use(options.serveRoot, express.static(clientPath, options.serveStaticOptions));
                const renderPath = typeof options.serveRoot === 'string'
                    ? options.serveRoot + (0, validate_path_util_1.validatePath)(options.renderPath)
                    : options.serveRoot;
                app.get(renderPath, renderFn);
            }
            else {
                app.use(express.static(clientPath, options.serveStaticOptions));
                app.get(options.renderPath, renderFn);
            }
            app.use((err, req, _res, next) => {
                if ((0, is_route_excluded_util_1.isRouteExcluded)(req, options.exclude)) {
                    const method = httpAdapter.getRequestMethod(req);
                    const url = httpAdapter.getRequestUrl(req);
                    return next(new common_1.NotFoundException(`Cannot ${method} ${url}`));
                }
                if (err instanceof common_1.HttpException) {
                    throw err;
                }
                else if (err?.message?.includes('ENOENT')) {
                    throw new common_1.NotFoundException(err.message);
                }
                else if (err?.code === 'ENOENT') {
                    throw new common_1.NotFoundException(`ENOENT: ${err.message}`);
                }
                else {
                    next(err);
                }
            });
        });
    }
};
exports.ExpressLoader = ExpressLoader;
exports.ExpressLoader = ExpressLoader = __decorate([
    (0, common_1.Injectable)()
], ExpressLoader);
