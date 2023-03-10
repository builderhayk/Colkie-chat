import { LeanDocument, Types } from "mongoose";
import { userDocument } from "../mongodb/models/user.schema";
import { IsString, IsNotEmpty } from "class-validator";

export interface LoginUserDto {
  username: string;
  password: string;
}

export type UserPayload = LeanDocument<userDocument> & { _id: Types.ObjectId };

export class CreateUserValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UserLoginValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
