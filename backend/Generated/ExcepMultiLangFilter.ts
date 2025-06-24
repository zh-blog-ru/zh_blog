import { Catch} from "@nestjs/common"
import { I18nValidationException, I18nValidationExceptionFilter } from "nestjs-i18n"

@Catch(I18nValidationException)
export class ExcepMultiLangFilter extends I18nValidationExceptionFilter {
    constructor() {
        super(
            {
                errorFormatter(errors) {
                    const errorModified: any = []
                    errors.forEach((item) => {
                        if (item.constraints) {
                            errorModified.push({
                                property: item.property,
                                errors: Object.values(item.constraints)
                            })
                        }
                    })
                    return errorModified
                },
            }
        )
    }
}