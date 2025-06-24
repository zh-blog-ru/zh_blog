import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./CreateUserDto.dto";

export class LoginUserDto extends PickType(CreateUserDto, ['username', 'password'] as const) {}