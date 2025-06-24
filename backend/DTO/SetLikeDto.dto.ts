import { IsBoolean} from "class-validator";
import { i18nValidationMessageType } from "src/i18n/generated/update";

export class SetLikeDto {
    @IsBoolean({
        message: i18nValidationMessageType('validation.INVALID_BOOLEAN'),
    }) 
    isLike: boolean;
}