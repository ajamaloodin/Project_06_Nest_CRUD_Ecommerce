import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,

  ){}

  async create(createUserDto: CreateUserDto) {
    
    try {
      
      const { password, ...userData } = createUserDto;

      //Esta instruccion solo prepara la inserción
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 ) 
        });
      //Aqui es donde se realiza efectivamente
      await this.userRepository.save( user );
      delete user.password;
      delete user.isActive;

      return {
        ...user,
        //token: this.getJwtToken({ email: user.email })
        token: this.getJwtToken({ id: user.id })
      };

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async login (loginUserDto: LoginUserDto) {

    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true}
    });

    if ( !user ) {
      throw new UnauthorizedException('Invalid Login Attempt - usr')
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid Login Attempt - psw')
    }

    return {
      ...user,
      //token: this.getJwtToken({ email: user.email })
      token: this.getJwtToken({ id: user.id })
    };

  }

  private getJwtToken( payload: JwtPayload) {

    const token = this.jwtService.sign( payload );
    return token;
  }

  private handleDBExceptions( error: any ): never {
    if ( error.code === '23505' ) { //23505 --> constrait de llave duplicada
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, please check logs');
  }

}
