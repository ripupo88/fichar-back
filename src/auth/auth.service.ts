import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ActivateUserDto,
  CreateUserDto,
  LoggedDto,
  LoginUserDto,
} from './dto/auth-credential.dto';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { EmpresaRepository } from 'src/empresas/empresa.repository';
import { Empresa } from 'src/empresas/empresa.entity';
import { User } from './user.entity';
import { ObjectID } from 'mongodb';

export type Notif = {
  entrada: boolean;
  salida: boolean;
  llegaTarde: boolean;
  salidaTemprano: boolean;
  nuevoDisp: boolean;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
    private jwtService: JwtService,
  ) {}

  async singUp(userData: CreateUserDto): Promise<LoggedDto> {
    const { username, role, code } = userData;
    let empresaId: string;
    let empresaAdmins: string[];
    const exist = await this.userRepository.find({ username });
    if (exist.length > 0) throw new ConflictException('El usuario ya existe');
    let empresa: Empresa[];
    if (role === 'USER') {
      if (!code)
        throw new BadRequestException('Debe poner un código de empresa');
      else {
        empresa = await this.empresaRepository.find({ code });
        if (empresa.length === 0)
          throw new BadRequestException(
            'Empresa no encontrada, revice su código',
          );
        empresaId = empresa[0]._id.toString();
        empresaAdmins = empresa[0].admins;
      }
    }
    const userId = await this.userRepository.createUser(
      userData,
      empresaAdmins,
      empresaId,
    );

    if (role === 'USER')
      await this.empresaRepository.update(
        { _id: empresa[0]._id },
        { trabajadores: [...empresa[0].trabajadores, userId] },
      );
    return await this.singIn(userData);
  }

  async tokenIn(_id: ObjectID): Promise<LoggedDto> {
    const user = await this.userRepository.findOne({ _id });
    if (user) {
      const payload = { username: user.username, role: user.role };
      const accesToken = await this.jwtService.sign(payload);
      await this.userRepository.setToken(user._id, accesToken);
      delete user.password;
      delete user.notifToken;
      delete user.Token;
      return { user, accesToken };
    } else {
      throw new UnauthorizedException();
    }
  }

  async singIn(userData: LoginUserDto): Promise<LoggedDto> {
    const { username, password, notifToken } = userData;
    const user = await this.userRepository.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { username, role: user.role };
      const accesToken = await this.jwtService.sign(payload);
      await this.userRepository.setToken(user._id, accesToken, notifToken);
      delete user.password;
      delete user.notifToken;
      delete user.Token;
      return { user, accesToken };
    } else {
      throw new UnauthorizedException();
    }
  }

  async activateUser(activateUserDto: ActivateUserDto): Promise<User> {
    const { username, nif, fullName, alias } = activateUserDto;
    const user = await this.userRepository.findOne({ username });
    if (!user.editable) throw new UnauthorizedException('User can´t be edited');
    await this.userRepository.update(
      { _id: user._id },
      { nif, fullName, alias, activo: true, editable: false },
    );

    const newuser = await this.userRepository.findOne({ username });
    delete newuser.password;
    return newuser;
  }

  async stopUser(userID: string) {
    const _id = new ObjectID(userID);
    await this.userRepository.update({ _id }, { activo: false });
    return await this.userRepository.findOne({ _id });
  }

  async setNotifUser(admin: string, userID: string, notifi: Notif) {
    const _id = new ObjectID(userID);
    const user = await this.userRepository.findOne({ _id });
    const notif = user.notif.map((item) => {
      if (item.admin === admin) {
        return { ...item, ...notifi };
      } else {
        return item;
      }
    });

    await this.userRepository.update({ _id }, { notif });
    return await this.userRepository.findOne({ _id });
  }
}
