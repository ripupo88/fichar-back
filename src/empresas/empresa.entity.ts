import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Empresa {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ unique: true })
  alias: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  cif: string;

  @Column({ unique: true })
  qrurl: string;

  @Column()
  admins: string[];

  // @Column()
  // options: Options;

  @Column()
  trabajadores: string[];
}

// class Options {
//   @Column()
//   isJornadaDividida: boolean;
//   @Column()
//   enabledPausa: boolean;
//   @Column()
//   turnos: {
//     lunes: string[];
//     martes: string[];
//     miercoles: string[];
//     jueves: string[];
//     viernes: string[];
//     sabado: string[];
//     domingo: string[];
//   };
// }
