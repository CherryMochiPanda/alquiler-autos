import {
  IsDate,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @IsUUID()
  userId: string;

  @IsUUID()
  carId: string;

  @IsUUID()
  pickupLocationId: string;

  @IsUUID()
  dropoffLocationId: string;

  @IsOptional()
  @IsBoolean()
  hasDriver?: boolean;

  @IsOptional()
  @IsNumber()
  totalPrice?: number;
}
