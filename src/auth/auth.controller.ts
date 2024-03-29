import { Controller, Get, Post, Body, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags   } from '@nestjs/swagger';

import { AuthService                 } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto/';
import { Auth, GetUser, RawHeaders   } from './decorators';
import { User                        } from './entities/user.entity';
import { UserRoleGuard               } from './guards/user-role/user-role.guard';
import { RoleProtected               } from './decorators/role-protected/role-protected.decorator';
import { ValidRoles                  } from './interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
    
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[]
  ) {
        
    return {
      ok: true,
      user,
      userEmail,
      rawHeaders
    }
  }
  // @SetMetadata('roles', ['admin', 'super'])

  @Get('private2')
  @RoleProtected(ValidRoles.user, ValidRoles.admin, ValidRoles.super)
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User,
  ) {
        
    return {
      ok: true,
      user,
    }
  }

  @Get('private3')
  @Auth(ValidRoles.user, ValidRoles.admin, ValidRoles.super)
  privateRoute3(
    @GetUser() user: User,
  ) {
        
    return {
      ok: true,
      user,
    }
  }
  

}


