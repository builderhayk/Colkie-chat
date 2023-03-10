import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, ObjectId, Types } from "mongoose";
import { user } from "./user.schema";

export type roomDocument = HydratedDocument<room>;

@Schema({ timestamps: true })
export class room {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: user.name }] })
  members: ObjectId[];

  @Prop({ type: Types.ObjectId, ref: user.name, required: true })
  creator: ObjectId;
}

export const roomSchema = SchemaFactory.createForClass(room);
