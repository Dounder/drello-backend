import { User } from './../users/entities/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from './../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { password, username } = signInDto;
    const user = await this.usersService.findOneByTerm(username);

    if (user.deletedAt) throw new ForbiddenException(`User is inactive talk with admin`);

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(`User credentials are not valid ( username / password )`);

    return { user, token: this.getJwtToken(user.id) };
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpDto);

    return { user, token: this.getJwtToken(user.id) };
  }

  async refresh(user: User): Promise<AuthResponse> {
    return { user: user, token: this.getJwtToken(user.id) };
  }

  private getJwtToken(id: string) {
    return this.jwtService.sign({ id });
  }
}
