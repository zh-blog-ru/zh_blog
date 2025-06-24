import { IsString, MaxLength, MinLength, } from "class-validator";
import { Match } from "Generated/MatchDecorator";
import { i18nValidationMessageType } from "src/i18n/generated/update";
import { CreateUserDto } from "./CreateUserDto.dto";
import { PickType } from "@nestjs/mapped-types";


export class ChangePasswordDto extends PickType(CreateUserDto, ['password'] as const) {

    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MinLength(8, {
        message: i18nValidationMessageType('validation.MINLENGTH'),
    })
    @MaxLength(128, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    newPassword: string;

    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MinLength(8, {
        message: i18nValidationMessageType('validation.MINLENGTH'),
    })
    @MaxLength(128, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    @Match("newPassword", {
        message: i18nValidationMessageType('validation.PASSWORD_EQUALITY')
    })
    confirmPassword: string
}

