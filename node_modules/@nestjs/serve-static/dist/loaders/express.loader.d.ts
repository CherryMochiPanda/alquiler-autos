import { AbstractHttpAdapter, ApplicationConfig } from '@nestjs/core';
import { ServeStaticModuleOptions } from '../interfaces/serve-static-options.interface';
import { AbstractLoader } from './abstract.loader';
export declare class ExpressLoader extends AbstractLoader {
    register(httpAdapter: AbstractHttpAdapter, config: ApplicationConfig, optionsArr: ServeStaticModuleOptions[]): void;
}
