import { EntityRepository, Repository } from 'typeorm';
import { Registro } from './entities/registros.entity';

@EntityRepository(Registro)
export class RegistroRepository extends Repository<Registro> {}
