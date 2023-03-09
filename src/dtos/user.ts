import { LeanDocument, ObjectId, Types } from "mongoose";
import { user } from "../mongodb/mongodb/models/user.schema";

export interface CreateUserDto {
  username: string;
  fullName: string;
  password: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface UserInfoDto {
  _id: ObjectId;
  id?: string;
  username: string;
  fullName: string;
}

export type UserPayload = LeanDocument<user> & { _id: Types.ObjectId };
