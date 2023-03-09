import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { user } from "./user.schema";
import { room } from "./room.schema";

export type chatDocument = HydratedDocument<chat>;

@Schema({ timestamps: { createdAt: true } })
export class chat {
  @Prop({ type: Types.ObjectId, ref:  user.name, required: true })
  user: ObjectId;

  @Prop({ type: Types.ObjectId, ref: room.name, required: true })
  room: ObjectId;

  @Prop({ required: true })
  message: string;
}

export const chatSchema = SchemaFactory.createForClass(chat);
