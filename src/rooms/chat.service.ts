import { ConflictException, Injectable } from "@nestjs/common";
import { Model, ObjectId } from "mongoose";
import { room, roomDocument } from "../mongodb/mongodb/models/room.schema";
import { InjectModel } from "@nestjs/mongoose";
import { chat, chatDocument } from "../mongodb/mongodb/models/chat.schema";
import { CreateChatDto } from "../dtos/chat";
import { user } from "../mongodb/mongodb/models/user.schema";

@Injectable()
export class ChatService {
  constructor(@InjectModel(chat.name) private chatModel: Model<chatDocument>) {}

  async createMessage(messageData: CreateChatDto): Promise<chatDocument> {
    const message = new this.chatModel(messageData);
    return message.save();
  }

  async getRoomMessages(
    roomId: string,
    page = 1,
    limit = 10
  ): Promise<chatDocument[]> {
    return this.chatModel
      .find({ room: roomId })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate(user.name, ["name", "_id"]);
  }
}
