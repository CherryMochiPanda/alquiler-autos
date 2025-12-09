import { Provider, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
export interface ServeStaticModuleOptions {
    rootPath?: string;
    renderPath?: string | RegExp;
    useGlobalPrefix?: boolean;
    serveRoot?: string;
    exclude?: string[];
    serveStaticOptions?: {
        acceptRanges?: boolean;
        cacheControl?: boolean;
        dotfiles?: string;
        etag?: boolean;
        fallthrough?: boolean;
        extensions?: string[];
        immutable?: boolean;
        index?: boolean | string | string[];
        lastModified?: boolean;
        maxAge?: number | string;
        redirect?: boolean;
        setHeaders?: (res: any, path: string, stat: any) => any;
        preCompressed?: boolean;
        decorateReply?: boolean;
    };
}
export interface ServeStaticModuleOptionsFactory {
    createLoggerOptions(): Promise<ServeStaticModuleOptions[]> | ServeStaticModuleOptions[];
}
export interface ServeStaticModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    isGlobal?: boolean;
    useExisting?: Type<ServeStaticModuleOptionsFactory>;
    useClass?: Type<ServeStaticModuleOptionsFactory>;
    useFactory?: (...args: any[]) => Promise<ServeStaticModuleOptions[]> | ServeStaticModuleOptions[];
    inject?: any[];
    extraProviders?: Provider[];
}
