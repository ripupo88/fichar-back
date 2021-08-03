import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/users.repository';
import { EmpresaRepository } from 'src/empresas/empresa.repository';
import { RegistroRepository } from './registro.repository';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ObjectID } from 'mongodb';

@Injectable()
export class RegistrosService {
  constructor(
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @InjectRepository(RegistroRepository)
    private registroRepository: RegistroRepository,
    private notificationsService: NotificationsService,
  ) {}

  async fichaEntrada(empresaId: string, user: User) {
    ///////Validaciones////////
    if (user.trabajando)
      throw new BadRequestException('Este usuario ya tiene un turno abierto');
    const empresa = await this.empresaRepository.findOne({ code: empresaId });
    if (!empresa || !empresa.trabajadores.includes(user._id.toString()))
      throw new BadRequestException('Codigo de empresa incorrecto');
    const date = new Date();
    const repetido = await this.registroRepository.findOne({
      dia: date.getDate(),
      year: date.getFullYear(),
      trabajador: user._id.toString(),
    });
    if (!!repetido) {
      throw new BadRequestException('Hoy ya se ha fichado');
    }
    ////////Fichando////////
    const registro = this.registroRepository.create({
      entrada: date.toISOString(),
      dia: date.getDate(),
      mes: date.getMonth(),
      year: date.getFullYear(),
      finalizado: false,
      trabajador: user._id.toString(),
    });
    await this.registroRepository.save(registro);
    await this.userRepository.update(
      { _id: user._id },
      { trabajando: true, horaEntrada: date.toISOString() },
    );
    //////notificar///////
    user.notif.map(async (item) => {
      const tokenNotif = await this.userRepository.findOne({
        _id: new ObjectID(item.admin),
      });
      if (item.entrada)
        this.notificationsService.entrada(user.alias, tokenNotif.notifToken);
    });
    return await this.registroRepository.findOne({ _id: registro._id });
  }

  async fichaSalida(empresaId: string, user: User) {
    if (!user.trabajando)
      throw new BadRequestException('Este usuario no tiene un turno abierto');

    const empresa = await this.empresaRepository.findOne({ code: empresaId });
    if (!empresa || !empresa.trabajadores.includes(user._id.toString()))
      throw new BadRequestException('Codigo de empresa incorrecto');
    const date = new Date();

    const registro = {
      salida: date.toISOString(),
      salidaCorrecta: true,
      finalizado: true,
    };

    await this.registroRepository.update(
      { finalizado: false, trabajador: user._id.toString() },
      registro,
    );
    await this.userRepository.update(
      { _id: user._id },
      { trabajando: false, horaEntrada: '' },
    );

    return await this.registroRepository.findOne({
      trabajador: user._id.toString(),
      dia: date.getDate(),
    });
  }
}
