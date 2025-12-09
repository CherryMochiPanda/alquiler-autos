import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateCarDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  pricePerDay: number;

  @IsString()
  plate: string;

  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsString()
  image?: string;
}
