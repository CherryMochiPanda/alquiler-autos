import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { CarsModule } from '../cars/cars.module';
import { RentalsModule } from '../rentals/rentals.module';

@Module({
  imports: [UsersModule, AuthModule, CarsModule, RentalsModule],
  controllers: [AdminController],
})
export class AdminModule {}
