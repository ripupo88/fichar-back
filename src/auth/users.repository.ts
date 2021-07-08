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
    await this.update({ _id }, { Token: token, notifToken });
  }

  async validateToken(token: string) {
    const user = await this.findOne({ Token: token });
    console.log(user);
    if (user) return true;
    return false;
  }

  async createUser(
    userData: CreateUserDto,
    empresaId?: string,
  ): Promise<string> {
    const { password } = userData;
    const salt = await bcrypt.genSalt();
    const hashedPass = await bcrypt.hash(password, salt);
    const user = this.create({
      ...userData,
      editable: true,
      trabajaPara: empresaId,
      password: hashedPass,
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
