import { Module } from "@nestjs/common";
import { RoomsController } from "./rooms.controller";
import { RoomsService } from "./rooms.service";
import { MongooseModule } from "@nestjs/mongoose";
import { user, userSchema } from "../mongodb/models/user.schema";
import { room, roomSchema } from "../mongodb/models/room.schema";
import { chat, chatSchema } from "../mongodb/models/chat.schema";
import { ChatService } from "./chat.service";
import { JwtStrategy } from "../auth/jwt.strategy";
import { AuthService } from "../auth/auth.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: room.name, schema: roomSchema }]),
    MongooseModule.forFeature([{ name: chat.name, schema: chatSchema }]),
  ],
  controllers: [RoomsController],
  providers: [RoomsService, ChatService, JwtStrategy, AuthService],
})
export class RoomsModule {}
