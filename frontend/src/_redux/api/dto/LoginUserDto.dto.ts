import { CreateUserDto } from "./CreateUserDto.dto";

export type LoginUserDto = Pick<CreateUserDto, 'username' | 'password'>