import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LocationHourService } from './location-hour.service';
import { CreateLocationHourDto } from './dto/create-location-hour.dto';
import { UpdateLocationHourDto } from './dto/update-location-hour.dto';

@Controller('location-hours')
export class LocationHourController {
  constructor(private readonly locationHourService: LocationHourService) {}

  @Post()
  create(@Body() createLocationHourDto: CreateLocationHourDto) {
    return this.locationHourService.create(createLocationHourDto);
  }

  @Get()
  findAll() {
    return this.locationHourService.findAll();
  }

  @Get('location/:locationId')
  findByLocation(@Param('locationId') locationId: string) {
    return this.locationHourService.findByLocation(locationId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationHourService.findOne(parseInt(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLocationHourDto: UpdateLocationHourDto,
  ) {
    return this.locationHourService.update(parseInt(id), updateLocationHourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationHourService.remove(parseInt(id));
  }
}
