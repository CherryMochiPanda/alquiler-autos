/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  Matches,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  email: string;

  // Contraseña: al menos 8 caracteres, una mayúscula y un número
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
  password: string;

  // Frontend usa firstName / lastName; los aceptamos aquí
  @Matches(/^[\p{L}\s]{2,50}$/u)
  firstName: string;

  @Matches(/^[\p{L}\s]{2,50}$/u)
  lastName: string;

  // Teléfono opcional, formato esperado: +53 followed by up to 8 digits
  @IsOptional()
  @Matches(/^\+53\s?[0-9]{1,8}$/)
  phone?: string;

  // Frontend marca DNI como requerido
  @Matches(/^[0-9]{11}$/)
  dni: string;

  @IsOptional()
  @IsIn(['admin', 'user'])
  role?: 'admin' | 'user';
}
