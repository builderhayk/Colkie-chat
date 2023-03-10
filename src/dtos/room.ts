import { ObjectId } from "mongoose";
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";

export class RoomIdValidationSchema {
  @IsMongoId({ message: "Room id not valid!!" })
  roomId: string;
}

export class CreateRoomValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

export class GetPaginatedListValidationSchema {
  @IsString()
  @IsOptional()
  search?: string = "";

  @Transform(({ value }) => parseInt(value))
  @Min(1)
  @IsNumber({}, { message: "Not valid page argument" })
  @IsOptional()
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @Min(10)
  @IsNumber({}, { message: "Not valid limit argument" })
  @IsOptional()
  limit: number = 10;
}

export class AddMemberToRoomValidationSchema {
  @IsMongoId({ message: "User id not valid!!" })
  userId: ObjectId;
  @IsMongoId({ message: "Room id not valid!!" })
  roomId: ObjectId;
}

export class CreatorIdValidationSchema {
  @IsMongoId({ message: "Creator id not valid!!" })
  creatorId: ObjectId;
}
