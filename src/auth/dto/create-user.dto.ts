import { IsEmail, IsString, MaxLength, MinLength, Matches } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsEmail()
    email   : string;

    @IsString()
    @MaxLength(50)
    @MinLength(6)
    @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsString()
    @MinLength(1)
    fullName: string;
}