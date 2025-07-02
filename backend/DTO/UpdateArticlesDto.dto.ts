import { PartialType } from '@nestjs/mapped-types';
import { CreateArticlesDto } from "./CreateArticlesDto.dto";
import { IsBoolean, IsLocale, IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateArticlesDto extends PartialType(CreateArticlesDto) {

    @IsOptional()
    @MaxLength(255)
    @IsString()
    title: string

    @IsOptional()
    @MaxLength(255)
    @IsString()
    resume: string

    @IsOptional()
    @IsString()
    content: string

    @IsOptional()
    @IsBoolean()
    is_active: boolean
}