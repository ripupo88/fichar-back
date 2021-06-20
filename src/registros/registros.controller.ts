import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { RoleGuard } from 'src/shared/role.guard';
import { RegistrosService } from './registros.service';

@Controller('registros')
@UseGuards(AuthGuard())
@UseGuards(RoleGuard(['USER']))
export class RegistrosController {
  constructor(private registrosService: RegistrosService) {}

  @Get('entrada/:empresaId')
  fichaEntrada(@Param('empresaId') empresaId: string, @getUser() user: User) {
    return this.registrosService.fichaEntrada(empresaId, user);
  }

  @Get('salida/:empresaId')
  fichaSalida(@Param('empresaId') empresaId: string, @getUser() user: User) {
    return this.registrosService.fichaSalida(empresaId, user);
  }
}
