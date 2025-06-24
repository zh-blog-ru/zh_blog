import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isTrue', async: false })
export class IsTrueConstraint implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return value === true;
  }

  defaultMessage(): string {
    return 'Значение должно быть true';
  }
}

export function IsTrue(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsTrueConstraint,
    });
  };
}