import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { user, userSchema } from "../mongodb/mongodb/models/user.schema";
import { JwtStrategy } from "./jwt.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: user.name, schema: userSchema }]),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
