import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { user, userDocument } from "../mongodb/mongodb/models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { CreateUserValidationSchema, UserLoginValidationSchema } from "../dtos/user";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService
  ) {}

  @Post("login")
  async login(@Body() body: UserLoginValidationSchema) {
    const user = await this.authService.findByLogin(body);
    const token = await this.authService.signPayload(user);
    return { ...user, token };
  }

  @Post("register")
  createUser(@Body() body: CreateUserValidationSchema): Promise<userDocument> {
    return this.authService.create(body);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  public async me(@Request() req) {
    return req.user;
  }
}
