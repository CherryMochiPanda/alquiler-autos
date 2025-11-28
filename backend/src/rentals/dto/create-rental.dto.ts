import {
  IsDateString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateRentalDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

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
