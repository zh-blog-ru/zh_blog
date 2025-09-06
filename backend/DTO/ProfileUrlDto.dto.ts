import { IsString } from "class-validator";
import { IsUUIDFile } from "Generated/IsUuidFileDecorator";
import { i18nValidationMessageType } from "src/i18n/generated/update";

export class ProfileUrlDTO {
    
    @IsUUIDFile('4', ['jpg'], {
        message: i18nValidationMessageType('validation.INCORRECT_FILENAME')
    })
    @IsString()
    profile_picture_url: string;
}