import { ObjectId } from "mongoose";
import { userDocument } from "../mongodb/mongodb/models/user.schema";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export interface CreateRoomDto {
  name: string;
  members: ObjectId[];
}

export interface RoomInfoDto {
  name: string;
  members: userDocument[];
}

export class RoomIdValidationSchema {
  @IsMongoId({ message: 'Room id not valid!!' })
  roomId: string;
}


export class CreateRoomValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}


export class GetPaginatedListValidationSchema {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit: number = 10;
}

export class AddMemberToRoomValidationSchema {
  @IsMongoId({ message: 'User id not valid!!' })
  userId: ObjectId;
  @IsMongoId({ message: 'Room id not valid!!' })
  roomId: ObjectId;
}

export class CreatorIdValidationSchema {
  @IsMongoId({ message: 'Creator id not valid!!' })
  creatorId: ObjectId;
}
