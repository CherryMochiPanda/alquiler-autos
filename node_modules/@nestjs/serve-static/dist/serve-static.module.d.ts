import { DynamicModule, OnModuleInit } from '@nestjs/common';
import { ApplicationConfig, HttpAdapterHost } from '@nestjs/core';
import { ServeStaticModuleAsyncOptions, ServeStaticModuleOptions } from './interfaces/serve-static-options.interface';
import { AbstractLoader } from './loaders/abstract.loader';
export declare class ServeStaticModule implements OnModuleInit {
    private readonly moduleOptions;
    private readonly loader;
    private readonly config;
    private readonly httpAdapterHost;
    constructor(moduleOptions: ServeStaticModuleOptions[], loader: AbstractLoader, config: ApplicationConfig, httpAdapterHost: HttpAdapterHost);
    static forRoot(...options: ServeStaticModuleOptions[]): DynamicModule;
    static forRootAsync(options: ServeStaticModuleAsyncOptions): DynamicModule;
    private static createAsyncProviders;
    private static createAsyncOptionsProvider;
    onModuleInit(): void;
}
