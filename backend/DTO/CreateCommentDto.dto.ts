import { IsString, Matches, MaxLength, MinLength } from "class-validator";
import { i18nValidationMessage } from "nestjs-i18n";
import { i18nValidationMessageType } from "src/i18n/generated/update";

export class CreateCommentDto {
    @IsString({
        message: i18nValidationMessageType('validation.STRING'),
    })
    @MaxLength(512, {
        message: i18nValidationMessageType('validation.MAXLENGTH'),
    })
    @MinLength(1, {
        message: i18nValidationMessageType('validation.MINLENGTH'),
    })
    @Matches(/^(?!\s*$).+/, {
        message: i18nValidationMessage('validation.NOT_EMPTY'),
    })
    comment: string;
}