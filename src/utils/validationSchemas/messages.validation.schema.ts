import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}
