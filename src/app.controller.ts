import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from "./app.service";
import { user, userDocument } from "./mongodb/mongodb/models/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "./auth/auth.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectModel(user.name) private userModel: Model<userDocument>,
    private authService: AuthService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.findByLogin(body);
    const payload = {
      id: user._id,
      username: user.username,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token};
  }

  @Post('register')
  createUser(@Request() req): Promise<userDocument> {
    return this.authService.create(req.body)
  }

  @Get('me')
  @UseGuards(AuthGuard("jwt"))
  public async me(@Request() req) {
    return req.user;
  }
}
