import { IsUUIDFile } from "Generated/IsUuidFileDecorator";
import { i18nValidationMessageType } from "src/i18n/generated/update";

export class ProfileUrlDTO {
    
    @IsUUIDFile('4', ['jpg'], {
        message: i18nValidationMessageType('validation.INCORRECT_FILENAME')
    })
    profile_picture_url: string;
}