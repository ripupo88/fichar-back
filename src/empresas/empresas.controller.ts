import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { RoleGuard } from 'src/shared/role.guard';
import { CrearEmpresaDto, getAllEmpDto } from './dto/Empresa.dto';
import { EmpresasService } from './empresas.service';

@Controller('empresas')
@UseGuards(AuthGuard())
@UseGuards(RoleGuard(['ADMIN']))
export class EmpresasController {
  constructor(private empresasService: EmpresasService) {}

  @Post()
  async createEmpresa(
    @Body() crearEmpresaDto: CrearEmpresaDto,
    @getUser() user: User,
  ) {
    crearEmpresaDto.admins = user;
    return await this.empresasService.createEmpresa(crearEmpresaDto);
  }

  @Get()
  async getAllEmpresas(@getUser() user: User): Promise<getAllEmpDto[]> {
    return await this.empresasService.getAllEmpresas(user._id.toString());
  }

  @Get(':code')
  @HttpCode(200)
  getFile(@Param('code') code: string, @Res() res: Response) {
    const lostream = createReadStream(`./qrcode/${code}.pdf`);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${code}.pdf`,
    });
    lostream.pipe(res);
  }
}
