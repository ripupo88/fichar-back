import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Registro {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  dia: number;

  @Column()
  mes: number;

  @Column()
  year: number;

  @Column()
  entrada: Date;

  @Column()
  finalizado: boolean;

  @Column()
  salida: Date;

  @Column()
  salidaCorrecta: boolean;

  @Column()
  trabajador: string;
}
