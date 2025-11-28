import { IsNumber, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateLocationHourDto {
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @IsString()
  openTime: string;

  @IsString()
  closeTime: string;

  @IsUUID()
  locationId: string;
}
