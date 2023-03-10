import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { userDocument } from "../mongodb/models/user.schema";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import {
  CreateUserValidationSchema,
  UserLoginValidationSchema,
} from "../utils/validationSchemas/user.validation.schema";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

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
