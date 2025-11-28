import { IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  name: string;
}
