import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { User } from 'src/auth/user.entity';

export class CrearEmpresaDto {
  @IsString()
  alias: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cif: string;

  @IsOptional()
  admins?: User;

  @IsString()
  @IsOptional()
  code: string;
}

export class getAllEmpDto {
  @IsString()
  alias: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cif: string;

  data: ActiveUsers[];
}

export class ActiveUsers {
  @IsString()
  _id: string;

  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  alias: string;

  @IsString()
  fullName: string;

  @IsNotEmpty()
  horaEntrada: Date;

  @IsNotEmpty()
  horaSalida: Date;

  @IsBoolean()
  @IsNotEmpty()
  trabajando: boolean;

  @IsBoolean()
  @IsNotEmpty()
  editable: boolean;
}
