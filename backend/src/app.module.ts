import { Module } from '@nestjs/common';
// ServeStatic handled in main.ts via NestExpressApplication
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CarsModule } from './cars/cars.module';
import { RentalsModule } from './rentals/rentals.module';
import { CategoryModule } from './category/category.module';
import { ProvinceModule } from './province/province.module';
import { LocationModule } from './location/location.module';
import { ReviewModule } from './review/review.module';
import { InventoryModule } from './inventory/inventory.module';
import { AuthModule } from './auth/auth.module';
import { AdminUserSeeder } from './database/seeders/admin-user.seeder';
import { User } from './users/entities/user.entity';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'admin',
      password: '12345',
      database: 'alquiler_autos_db',

      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    CarsModule,
    RentalsModule,
    CategoryModule,
    ProvinceModule,
    LocationModule,
    ReviewModule,
    InventoryModule,
    AuthModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminUserSeeder],
})
export class AppModule {}
