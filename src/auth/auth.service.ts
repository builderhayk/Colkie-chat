import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { user, userDocument } from "../mongodb/models/user.schema";
import { LeanDocument, Model, Types } from "mongoose";
import { CreateUserValidationSchema } from "../utils/validationSchemas/user.validation.schema";
import * as bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { LoginUserDto, UserPayload } from "../dtos/user";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(user.name) private userModel: Model<userDocument>,
    private readonly configService: ConfigService
  ) {}

  async create(userDto: CreateUserValidationSchema): Promise<userDocument> {
    const existingUser = await this.findOne(userDto.username);
    if (existingUser) {
      throw new ConflictException("Username already exists");
    }
    const createdUser = new this.userModel(userDto);
    const savedUser = await createdUser.save();
    this.sanitizeUser(savedUser);
    return savedUser;
  }

  async findOne(
    username: string
  ): Promise<LeanDocument<user> & { _id: Types.ObjectId }> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByLogin(UserDTO: LoginUserDto): Promise<UserPayload> {
    const { username, password } = UserDTO;
    const user = await this.userModel.findOne({ username }, { password: 1 }).exec();
    if (!user) {
      throw new HttpException("user doesnt exists", HttpStatus.BAD_REQUEST);
    }
    console.log(UserDTO, password, user, this.configService.get<string>("SECRET_KEY"), this.configService.get<string>("EXPIRES_IN"));

    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException("invalid credential", HttpStatus.BAD_REQUEST);
    }
  }
  sanitizeUser(user: userDocument): UserPayload {
    const sanitized = user.toObject();
    delete sanitized["password"];
    return sanitized;
  }
  async validateUser(payload: LoginUserDto): Promise<userDocument | undefined> {
    const { username } = payload;
    return this.userModel.findOne({ username });
  }

  async signPayload(payload: { _id: Types.ObjectId; username: string }) {
    return sign(payload, this.configService.get<string>("SECRET_KEY"), {
      expiresIn: this.configService.get<string>("EXPIRES_IN"),
    });
  }

  async verifyToken(token: string) {
    return verify(token, this.configService.get<string>("SECRET_KEY"));
  }
}
