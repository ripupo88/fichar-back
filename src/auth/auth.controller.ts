import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/shared/role.guard';
import { AuthService } from './auth.service';
import {
  ActivateUserDto,
  CreateUserDto,
  LoggedDto,
  LoginUserDto,
} from './dto/auth-credential.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('singup')
  SingUp(@Body() userData: CreateUserDto): Promise<LoggedDto> {
    return this.authService.singUp(userData);
  }

  @Post('singin')
  SingIn(@Body() userData: LoginUserDto): Promise<LoggedDto> {
    return this.authService.singIn(userData);
  }

  @Post('activate')
  @UseGuards(AuthGuard())
  @UseGuards(RoleGuard(['ADMIN']))
  activateUser(@Body() activateUserDto: ActivateUserDto): Promise<User> {
    return this.authService.activateUser(activateUserDto);
  }

  @Get('baja/:id')
  @UseGuards(AuthGuard())
  @UseGuards(RoleGuard(['ADMIN']))
  stopUser(@Param('id') userId: string) {
    return this.authService.stopUser(userId);
  }
}
