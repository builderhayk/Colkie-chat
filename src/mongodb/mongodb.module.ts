import { Module } from "@nestjs/common";
import { MongodbService } from "./connection/mongodb.service";
import { Connection } from "mongoose";
import { user, userSchema } from "./models/user.schema";
import { room, roomSchema } from "./models/room.schema";
import { chat, chatSchema } from "./models/chat.schema";

@Module({
  imports: [],
  providers: [
    MongodbService,
    {
      provide: "USER_MODEL",
      useFactory: (connection: Connection) =>
        connection.model(user.name, userSchema),
      inject: ["DATABASE_CONNECTION"],
    },
    {
      provide: "ROOM_MODEL",
      useFactory: (connection: Connection) =>
        connection.model(room.name, roomSchema),
      inject: ["DATABASE_CONNECTION"],
    },
    {
      provide: "CHAT_MODEL",
      useFactory: (connection: Connection) =>
        connection.model(chat.name, chatSchema),
      inject: ["DATABASE_CONNECTION"],
    },
  ],
  exports: [
    {
      provide: "USER_MODEL",
      useFactory: (connection: Connection) =>
        connection.model(user.name, userSchema),
      inject: ["DATABASE_CONNECTION"],
    },
    {
      provide: "ROOM_MODEL",
      useFactory: (connection: Connection) =>
        connection.model(room.name, roomSchema),
      inject: ["DATABASE_CONNECTION"],
    },
    {
      provide: "CHAT_MODEL",
      useFactory: (connection: Connection) =>
        connection.model(chat.name, chatSchema),
      inject: ["DATABASE_CONNECTION"],
    },
  ],
})
export class MongodbModule {}
