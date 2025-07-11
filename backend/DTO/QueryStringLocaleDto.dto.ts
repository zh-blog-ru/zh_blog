import { IsLocale, IsString } from "class-validator";

export class LocaleStringDTO {
    
    @IsString()
    @IsLocale()
    locale: string;
}