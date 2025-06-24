import { PickType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./CreateUserDto.dto";

export class UsernameDTO extends PickType(CreateUserDto, ['username'] as const) {}
