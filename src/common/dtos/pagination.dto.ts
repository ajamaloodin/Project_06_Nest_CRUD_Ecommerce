import { ApiProperty } from "@nestjs/swagger";

import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @ApiProperty({
        default: 10, description: 'Number of row/items you need',

    })
    @IsOptional()
    @IsPositive()
    @Type( () => Number ) //Es lo mismo que enableImplicitConversion: true en el main
    limit? : number;

    @ApiProperty({
        default: 0, description: 'An Optional number of row/items to skip',
    })
    @IsOptional()
    // @IsPositive()   el cero no lo considera positivo!
    @Min(0)
    @Type( () => Number )
    offset?: number;
}