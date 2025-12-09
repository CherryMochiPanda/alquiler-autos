import { AbstractHttpAdapter, ApplicationConfig } from '@nestjs/core';
import { ServeStaticModuleOptions } from '../interfaces/serve-static-options.interface';
export declare abstract class AbstractLoader {
    abstract register(httpAdapter: AbstractHttpAdapter, config: ApplicationConfig, options: ServeStaticModuleOptions[]): any;
    getIndexFilePath(clientPath: string): string;
}
