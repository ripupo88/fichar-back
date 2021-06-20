import { User } from 'src/auth/user.entity';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class Empresa {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ unique: true })
  cif: string;

  @Column()
  admins: string[];

  @Column()
  trabajadores: string[];
}
