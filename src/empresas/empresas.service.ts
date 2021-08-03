import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/users.repository';
import { ObjectID } from 'mongodb';
import { CrearEmpresaDto, getAllEmpDto } from './dto/Empresa.dto';
import { EmpresaRepository } from './empresa.repository';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(EmpresaRepository)
    private empresaRepository: EmpresaRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async createEmpresa(crearEmpresaDto: CrearEmpresaDto) {
    const { admins } = crearEmpresaDto;
    const idEmpresa = await this.empresaRepository.crearEmpresa(
      crearEmpresaDto,
    );
    await this.userRepository.addEmpresa(admins._id, idEmpresa);
  }

  async getAllEmpresas(user: string): Promise<getAllEmpDto[]> {
    const empresas = await this.empresaRepository.find({ admins: [user] });
    let res: getAllEmpDto[] = [];

    for (const empresa of empresas) {
      const resp = {
        alias: empresa.alias,
        name: empresa.name,
        cif: empresa.cif,
        code: empresa.code,
        data: [],
      };
      for (const trabajador of empresa.trabajadores) {
        const _id = new ObjectID(trabajador);
        const trabInfo = await this.userRepository.findOne({
          _id,
        });
        const notif = trabInfo.notif.filter((data) => data.admin === user);
        resp.data = [
          ...resp.data,
          {
            _id: trabInfo._id,
            username: trabInfo.username,
            fullName: trabInfo.fullName,
            alias: trabInfo.alias,
            horaEntrada: trabInfo.horaEntrada,
            trabajando: trabInfo.trabajando,
            editable: trabInfo.editable,
            nif: trabInfo.nif,
            activo: trabInfo.activo,
            notif: notif[0],
          },
        ];
        // console.log(resp.data);
      }
      res = [...res, resp];
    }
    console.log(res);
    return res;
  }
}
