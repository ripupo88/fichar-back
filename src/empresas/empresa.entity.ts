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

  @Column()
  trabajadores: string[];
}
