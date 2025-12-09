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
exports.FastifyLoader = void 0;
const common_1 = require("@nestjs/common");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const fs = __importStar(require("fs"));
const serve_static_constants_1 = require("../serve-static.constants");
const validate_global_prefix_util_1 = require("../utils/validate-global-prefix.util");
const validate_path_util_1 = require("../utils/validate-path.util");
const abstract_loader_1 = require("./abstract.loader");
let FastifyLoader = class FastifyLoader extends abstract_loader_1.AbstractLoader {
    register(httpAdapter, config, optionsArr) {
        const app = httpAdapter.getInstance();
        const globalPrefix = config.getGlobalPrefix();
        const fastifyStatic = (0, load_package_util_1.loadPackage)('@fastify/static', 'ServeStaticModule', () => require('@fastify/static'));
        optionsArr.forEach((options) => {
            options.renderPath = options.renderPath ?? serve_static_constants_1.DEFAULT_FASTIFY_RENDER_PATH;
            const clientPath = options.rootPath ?? serve_static_constants_1.DEFAULT_ROOT_PATH;
            const indexFilePath = this.getIndexFilePath(clientPath);
            if (globalPrefix &&
                options.useGlobalPrefix &&
                (0, validate_global_prefix_util_1.validateGlobalPrefix)(globalPrefix)) {
                options.serveRoot = `/${globalPrefix}${options.serveRoot || ''}`;
            }
            const renderFn = (req, res) => {
                if (!options.serveStaticOptions?.fallthrough) {
                    const error = new common_1.NotFoundException();
                    res.status(error.getStatus()).send(error.getResponse());
                    return;
                }
                fs.stat(indexFilePath, (err, stat) => {
                    if (err) {
                        const error = new common_1.NotFoundException();
                        res.status(error.getStatus()).send(error.getResponse());
                        return;
                    }
                    const stream = fs.createReadStream(indexFilePath);
                    if (options.serveStaticOptions?.setHeaders) {
                        options.serveStaticOptions.setHeaders(res, indexFilePath, stat);
                    }
                    res.type('text/html').send(stream);
                });
            };
            if (options.serveRoot) {
                app.register(fastifyStatic, {
                    root: clientPath,
                    ...(options.serveStaticOptions || {}),
                    wildcard: false,
                    prefix: options.serveRoot
                });
                const renderPath = typeof options.serveRoot === 'string'
                    ? options.serveRoot + (0, validate_path_util_1.validatePath)(options.renderPath)
                    : options.serveRoot;
                app.get(renderPath, renderFn);
            }
            else {
                app.register(fastifyStatic, {
                    root: clientPath,
                    ...(options.serveStaticOptions || {}),
                    wildcard: false
                });
                app.get(options.renderPath, renderFn);
            }
        });
    }
};
exports.FastifyLoader = FastifyLoader;
exports.FastifyLoader = FastifyLoader = __decorate([
    (0, common_1.Injectable)()
], FastifyLoader);
