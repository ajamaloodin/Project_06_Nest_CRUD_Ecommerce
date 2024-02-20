import { Type } from "class-transformer";
import { IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @Type( () => Number ) //Es lo mismo que enableImplicitConversion: true en el main
    limit? : number;

    @IsOptional()
    // @IsPositive()   el cero no lo considera positivo!
    @Min(0)
    @Type( () => Number )
    offset?: number;
}