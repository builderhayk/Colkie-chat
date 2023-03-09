import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import * as bcrypt from "bcrypt";

export type userDocument = HydratedDocument<user>;

@Schema()
export class user {
  @Prop({ required: true, min: 4, max: 50, unique: true })
  username: string;

  @Prop({ required: true, min: 4, max: 50 })
  fullName: string;

  @Prop({ required: true, min: 4, max: 50 })
  password: string;
}

export const userSchema = SchemaFactory.createForClass(user);

userSchema.pre('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});
