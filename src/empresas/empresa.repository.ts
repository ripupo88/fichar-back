import { ConflictException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CrearEmpresaDto } from './dto/Empresa.dto';
import { Empresa } from './empresa.entity';

@EntityRepository(Empresa)
export class EmpresaRepository extends Repository<Empresa> {
  async crearEmpresa(crearEmpresDto: CrearEmpresaDto): Promise<string> {
    const { name, cif } = crearEmpresDto;

    const nameExist = await this.find({ name });
    const cifExist = await this.find({ cif });
    if (nameExist.length > 0 || cifExist.length > 0)
      throw new ConflictException('Existe otra empresa con esos datos');

    let codeExist = [];
    let code: string;
    do {
      code = Math.round(Math.random() * 899999 + 100000).toString();
      codeExist = await this.find({ code });
    } while (codeExist.length > 0);
    const empresa: Empresa = this.create({
      ...crearEmpresDto,
      trabajadores: [],
      admins: [crearEmpresDto.admins._id.toString()],
      code,
    });
    const newEmpresa = await this.save(empresa);
    return newEmpresa._id.toString();
  }
}
