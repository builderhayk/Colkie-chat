import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export interface CreateChatDto {
  user: string;
  room: string;
  message: string;
}

export class CreateMessageValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly message: string;
}
