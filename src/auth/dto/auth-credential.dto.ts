import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20, { message: 'Nombre de usuario muy largo' })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Contraseña muy devil',
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
  @MinLength(2)
  @MaxLength(20, { message: 'Nombre de usuario muy largo' })
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Contraseña muy devil',
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
export class UserDto {
  @IsString()
  username: string;

  @IsString()
  fullName: string;

  @IsString()
  nif: string;

  @IsString()
  alias: string;
}

export type LoggedDto = {
  user: UserDto;
  accesToken: string;
};

export type tokenDecoded = {
  username: string;
  role: string;
};
