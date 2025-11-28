import { IsNumber, IsString, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  carId: string;
}
