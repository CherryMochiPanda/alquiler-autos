import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateCarDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsNumber()
  pricePerDay: number;

  @IsString()
  plate: string;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
