import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationHourService } from './location-hour.service';
import { LocationHourController } from './location-hour.controller';
import { Location } from './entities/location.entity';
import { LocationHour } from './entities/location-hour.entity';
import { Province } from '../province/entities/province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, LocationHour, Province])],
  controllers: [LocationController, LocationHourController],
  providers: [LocationService, LocationHourService],
  exports: [LocationService, LocationHourService],
})
export class LocationModule {}
