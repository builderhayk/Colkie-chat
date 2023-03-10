import { Module } from "@nestjs/common";
import { RoomsModule } from "../rooms/rooms.module";
import { WebsocketGateway } from "./socket.gateway";
import { UsersModule } from "../users/users.module";
import { RoomsService } from "../rooms/rooms.service";
import { ChatService } from "../rooms/chat.service";
import { MongooseModule } from "@nestjs/mongoose";
import { user, userSchema } from "../mongodb/models/user.schema";
import { room, roomSchema } from "../mongodb/models/room.schema";
import { chat, chatSchema } from "../mongodb/models/chat.schema";
import { AuthService } from "../auth/auth.service";
import { AuthModule } from "../auth/auth.module";
import { SocketSessionGuard } from "./socket.session.guard";

@Module({
  imports: [
    RoomsModule,
    RoomsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: user.name, schema: userSchema }]),
    MongooseModule.forFeature([{ name: room.name, schema: roomSchema }]),
    MongooseModule.forFeature([{ name: chat.name, schema: chatSchema }]),
  ],
  providers: [
    SocketSessionGuard,
    WebsocketGateway,
    RoomsModule,
    AuthService,
    AuthModule,
    UsersModule,
    RoomsService,
    ChatService,
  ],
})
export class SocketModule {}
