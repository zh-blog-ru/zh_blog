import { IsLocale, IsOptional, IsString } from "class-validator";

export class LocaleStringDTO {
    
    @IsString()
    @IsLocale()
    @IsOptional()
    locale: string;
}