import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  carId: string;

  @IsUUID()
  locationId: string;

  @IsNumber()
  @Min(0)
  stock: number;
}
