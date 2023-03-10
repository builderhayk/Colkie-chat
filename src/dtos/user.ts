import { LeanDocument, Types } from "mongoose";
import { userDocument } from "../mongodb/models/user.schema";
import { IsString, IsNotEmpty } from "class-validator";

export interface LoginUserDto {
  username: string;
  password: string;
}

export type UserPayload = LeanDocument<userDocument> & { _id: Types.ObjectId };
