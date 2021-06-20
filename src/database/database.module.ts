import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      useUnifiedTopology: true,
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      database: 'task-management',
      autoLoadEntities: true,
      synchronize: false,
      useNewUrlParser: true,
    }),
  ],
})
export class DatabaseModule {}
