// src/dto/CodeBodyDto.dto.ts
import { IntersectionType, OmitType} from '@nestjs/mapped-types';
import { IsBoolean, IsEmail, IsString, Length, MaxLength } from 'class-validator';
import { i18nValidationMessageType } from 'src/i18n/generated/update';
import { CreateUserDto } from './CreateUserDto.dto';
import { IsTrue } from 'Generated/TrueDecorator';

export class CheckCodeDto {

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


    @Length(6, 6, {
        message: i18nValidationMessageType('validation.LENGTH')
    })
    @IsString({
        message: i18nValidationMessageType('validation.STRING')
    })
    code: string;

}
export class SendCodeDto {
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

    @IsString()
    token: string
}

export class CheckCodeNoEmailDto extends OmitType(CheckCodeDto, ['email'] as const) { }
export class SendCodeNoEmailDto extends OmitType(SendCodeDto, ['email'] as const) { }

export class RegistrationCodeDto extends IntersectionType(
    SendCodeNoEmailDto,
    CreateUserDto,
) {

    @IsBoolean({
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    @IsTrue({
        message: i18nValidationMessageType('validation.POLITIC')
    })
    politic: boolean
}