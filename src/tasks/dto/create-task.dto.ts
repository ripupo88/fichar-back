import { IsNotEmpty } from 'class-validator';
import { User } from 'src/auth/user.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  user?: User;
}
