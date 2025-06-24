import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./CreateUserDto.dto";

export class ResetPasswordDTO extends PickType(CreateUserDto, ['password', 'confirmPassword'] as const) {}
