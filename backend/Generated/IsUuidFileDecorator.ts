import {
  isUUID,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

export type UUIDVersion = "1" | "2" | "3" | "4" | "5" | "7" | "all" | 1 | 2 | 3 | 4 | 5 | 7;

@ValidatorConstraint({ name: 'IsUUIDFile' })
export class IsUUIDFileConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    if (value === undefined || value === null) {
      return true; // для @IsOptional()
    }

    const [uuidVersion, allowedExtensions] = args.constraints as [UUIDVersion, string[]];

    const parts = value.split('.');
    const [filename, extension] = parts

    // Проверяем UUID
    if (!isUUID(filename, uuidVersion)) {
      return false;
    }
    if ((!allowedExtensions || allowedExtensions.length === 0)) {
      return true;
    }
    if (!(parts.length == 2)) {
      return false; // или нет расширение или их больше 1
    }

    return allowedExtensions.includes(extension);
  }
}

export function IsUUIDFile(
  uuidVersion: UUIDVersion,
  allowedExtensions: string[] = [],
  validationOptions?: ValidationOptions
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [uuidVersion, allowedExtensions],
      validator: IsUUIDFileConstraint,
    });
  };
}