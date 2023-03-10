import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { ObjectId } from "mongoose";

export class RoomIdValidationSchema {
  @IsMongoId({ message: "Room id not valid!!" })
  roomId: string;
}

export class CreateRoomValidationSchema {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
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
