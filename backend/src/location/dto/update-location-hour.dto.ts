import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationHourDto } from './create-location-hour.dto';

export class UpdateLocationHourDto extends PartialType(CreateLocationHourDto) {}
