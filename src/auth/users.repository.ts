import { EntityRepository, ObjectID, Repository } from 'typeorm';
import { CreateUserDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { EmpresaRepository } from 'src/empresas/empresa.repository';
import { InjectRepository } from '@nestjs/typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  constructor(
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
  ) {
    super();
  }

  async setToken(_id: ObjectID, token: string, notifToken?: string) {
    const dataToUpdate = notifToken
      ? { Token: token, notifToken }
      : { Token: token };
    await this.update({ _id }, dataToUpdate);
  }

  async validateToken(token: string) {
    const user = await this.findOne({ Token: token });
    if (user) return true;
    return false;
  }

  async createUser(
    userData: CreateUserDto,
    empresaAdmins?: string[],
    empresaId?: string,
  ): Promise<string> {
    const { password } = userData;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const notif = empresaAdmins?.map((item) => {
      return {
        admin: item,
        entrada: true,
        llegaTarde: true,
        nuevoDisp: true,
        salida: true,
        salidaTemprano: true,
      };
    });

    const user = this.create({
      ...userData,
      editable: true,
      trabajaPara: empresaId,
      password: hashedPass,
      activo: true,
      notif,
    });
    const userCreated = await this.save(user);
    return userCreated._id.toString();
  }

  async addEmpresa(userID: ObjectID, empresaID: string): Promise<void> {
    const user = await this.findOne({ _id: userID });
    if (!!user.empresas) {
      this.update({ _id: userID }, { empresas: [...user.empresas, empresaID] });
    } else {
      this.update({ _id: userID }, { empresas: [empresaID] });
    }
  }
}
