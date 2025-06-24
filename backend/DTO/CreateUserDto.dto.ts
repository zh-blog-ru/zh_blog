import { IsEmail, IsString, Matches, MaxLength, MinLength, } from "class-validator";
import { Match } from "Generated/MatchDecorator";
import { i18nValidationMessageType } from "src/i18n/generated/update";


export class CreateUserDto {
    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MinLength(5, {
        message: i18nValidationMessageType('validation.MINLENGTH'),
    })
    @MaxLength(32, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    // @IsAlphanumeric()
    @Matches(/^[a-zA-Z0-9_]*$/, {
        message: i18nValidationMessageType('validation.MATCHES_USERNAME')
    })
    username: string;

    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    }) 
    @MaxLength(64, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    @IsEmail({}, {
        message: i18nValidationMessageType("validation.INVALID_EMAIL")
    })
    email: string;

    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MinLength(8, {
        message: i18nValidationMessageType('validation.MINLENGTH'),
    })
    @MaxLength(128, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    password: string;

    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MinLength(8, {
        message: i18nValidationMessageType('validation.MINLENGTH'),
    })
    @MaxLength(128, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    @Match("password", {
        message: i18nValidationMessageType('validation.PASSWORD_EQUALITY')
    })
    confirmPassword: string
}

