import { BadRequestException, ConflictException } from '@nestjs/common';
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
