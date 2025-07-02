import { IsArray, IsLocale, IsNumber, IsString, IsUrl, MaxLength } from "class-validator"


export class CreateArticlesDto {

    @IsString()
    @IsUrl()
    img: string

    @IsArray()
    @IsString({each: true})
    @MaxLength(16, {each: true})
    theme: string[]

    @IsNumber()
    time_to_read: number
}