import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/create.user.dto';
import { AuthDto } from './dto/auth.dto';
import { HttpAccessTokenGuard } from './guards/http/HttpAccessToken.guard';
import { RefreshTokenGuard } from './guards/http/refreshToken.guard';
import { Token } from './types/types';
import { AuthService } from './user.auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const tokens = await this.authService.signUp(createUserDto);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.send({
      accessToken: tokens.accessToken,
    });
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(
    @Res({ passthrough: true }) res: Response,
    @Body() data: AuthDto,
  ) {
    const tokens = await this.authService.signIn(data);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.send({
      accessToken: tokens.accessToken,
    });
  }

  @UseGuards(HttpAccessTokenGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    await this.authService.logout(req.user['id']);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
    });
    res.send(200);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Res() res: Response, @Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    const { id } = this.jwtService.decode<Token>(refreshToken);
    const newTokens = await this.authService.refreshTokens(
      id.toString(),
      refreshToken,
    );

    res.cookie('refreshToken', newTokens.refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.send({
      accessToken: newTokens.accessToken,
    });
  }
}
