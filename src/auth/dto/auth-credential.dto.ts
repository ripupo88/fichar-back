import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  maxLength,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ObjectID } from 'typeorm';

export class CreateUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;

  @IsEnum(['USER', 'ADMIN'])
  role: string;

  @IsOptional()
  @IsString()
  @Matches(/\d{6}/, { message: 'Codigo de empresa incorrecto' })
  code?: string;
}

export class LoginUserDto {
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}

export class ActivateUserDto {
  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsString()
  nif: string;

  @IsString()
  alias: string;
}
