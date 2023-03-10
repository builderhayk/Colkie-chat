import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Model, ObjectId } from "mongoose";
import { room, roomDocument } from "../mongodb/models/room.schema";
import { InjectModel } from "@nestjs/mongoose";
import {
  AddMemberToRoomValidationSchema,
  CreatorIdValidationSchema,
} from "../utils/validationSchemas/rooms.validation.schema";

@Injectable()
export class RoomsService {
  constructor(@InjectModel(room.name) private roomModel: Model<roomDocument>) {}

  async createRoom(
    creatorId: ObjectId,
    userId: ObjectId,
    name: string
  ): Promise<roomDocument> {
    const existingRoom = await this.roomModel.findOne({ name });
    if (existingRoom) {
      throw new ConflictException("Room with this name already exists");
    }

    const user = new this.roomModel({
      name,
      members: [userId],
      creator: creatorId,
    });
    return user.save();
  }

  async getRoom(roomId: string): Promise<roomDocument> {
    return this.roomModel.findById(roomId).populate("members", "-password");
  }

  async getUserRooms(
    userId: ObjectId,
    page = 1,
    limit = 10
  ): Promise<roomDocument[]> {
    return this.roomModel
      .find({ members: userId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("members", "-password");
  }

  async addMemberToRoom({
    creatorId,
    userId,
    roomId,
  }: AddMemberToRoomValidationSchema &
    CreatorIdValidationSchema): Promise<roomDocument> {
    const room = await this.roomModel.findById(roomId);
    if (!room) {
      throw new NotFoundException("Room not found");
    }
    if (room.creator !== creatorId) {
      throw new ForbiddenException(
        "Only admin of room can add users to room!!"
      );
    }
    room.members = [...new Set([...room.members, userId])];
    await room.save();

    return room.populate("members");
  }
}
