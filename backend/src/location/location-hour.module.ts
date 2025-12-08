import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationHourService } from './location-hour.service';
import { LocationHourController } from './location-hour.controller';
import { LocationHour } from './entities/location-hour.entity';
import { Location } from '../location/entities/location.entity'; // Necesario si el servicio verifica la Location

@Module({
  imports: [TypeOrmModule.forFeature([LocationHour, Location])], // Inyectamos la entidad LocationHour y Location
  controllers: [LocationHourController],
  providers: [LocationHourService],
  exports: [LocationHourService],
})
export class LocationHourModule {}
