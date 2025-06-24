import {PickType } from "@nestjs/mapped-types";
import { IsString, MaxLength } from "class-validator";
import { i18nValidationMessageType } from "src/i18n/generated/update";
import { CreateUserDto } from "./CreateUserDto.dto";


export class UpdateUserDto extends PickType(CreateUserDto, ['username']) {
    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MaxLength(512, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    about_me: string | null;

}

