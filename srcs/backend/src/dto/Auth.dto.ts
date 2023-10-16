// Importing validation decorators from 'class-validator' package
import {    
    IsNotEmpty, 
    IsString, 
    IsEmail,
 } from "class-validator";

// The DTO (Data Transfer Object) for authentication operations
export class AuthDto {
@IsNotEmpty() @IsString()  @IsEmail() email!: string;
@IsNotEmpty() @IsString()  username!: string;
@IsNotEmpty() @IsString()  password!: string;
}
