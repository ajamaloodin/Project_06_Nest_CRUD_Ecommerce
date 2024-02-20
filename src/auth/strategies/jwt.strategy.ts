import { ConfigService         } from "@nestjs/config";
import { PassportStrategy      } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository      } from "@nestjs/typeorm";

import { ExtractJwt, Strategy  } from "passport-jwt";
import { JwtPayload            } from "../interfaces/jwt-payload.interface";
import { User                  } from "../entities/user.entity";
import { Repository            } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {

    constructor(
        @InjectRepository( User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService,
    ) {
        super({
           secretOrKey: configService.get('JWT_SECRET'),
           jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate( payload: JwtPayload): Promise<User> {

        //const { email } = payload;
        const { id } = payload;

        //const user = await this.userRepository.findOneBy({ email });
        const user = await this.userRepository.findOneBy({ id });

        if (!user) {
            throw new UnauthorizedException('Token/User is not valid');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User looks to be marked for deletion. Contact admin.');
        }
        // Al hacer return del usuario, este estará disponible en el request y se podrá acceder a él en 
        //cualquier punto.
        return user;
    }

}