import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ unique: true })
  username: string;

  @Column()
  fullName: string;

  @Column()
  nif: string;

  @Column()
  alias: string;

  @Column()
  trabajando: boolean;

  @Column()
  horaEntrada: Date;

  @Column({ default: true })
  editable: boolean;

  @Column()
  empresas?: string[];

  @Column()
  Token?: string;

  @Column()
  notifToken?: string;

  @Column('boolean', { default: true })
  activo: boolean;

  @Column({ enum: ['ADMIN', 'USER'], default: 'USER' })
  role: string;

  @Column({ select: false })
  @Exclude()
  password: string;

  @Column()
  @IsString()
  @IsOptional()
  trabajaPara?: string;
}
