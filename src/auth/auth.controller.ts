import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from './../users/entities/user.entity';

import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign_up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('refresh_token')
  @Auth()
  refresh(@GetUser() user: User) {
    return this.authService.refresh(user);
  }
}
