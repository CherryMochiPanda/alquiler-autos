import { IsInt, IsString, IsOptional, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
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
