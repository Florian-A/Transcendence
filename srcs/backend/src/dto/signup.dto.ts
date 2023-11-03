// Importing validation decorators from 'class-validator' package
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    MinLength,
    Matches,
    MaxLength,
} from "class-validator";

export class SignupDto {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: "Username must be less than 20 characters long" })
    @MinLength(4, { message: "Username must be at least 4 characters long" })
    @Matches(/^(?=.*[a-zA-Z])([^\s])*$/,
        { message: "Username must contain at least one alphabetic character and must not contain spaces" })
    username!: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(20, { message: "Password must be less than 20 characters long" })
    @MinLength(8, { message: "Password must be at least 8 characters long" })
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/,
        { message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character" })
    password!: string;
}