import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { user, userDocument } from "../mongodb/mongodb/models/user.schema";
import { LeanDocument, Model, Types } from "mongoose";
import { CreateUserDto, LoginUserDto, UserPayload } from "../dtos/user";
import * as bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(user.name) private userModel: Model<userDocument>,
  ) {}

  async create(userDto: CreateUserDto): Promise<userDocument> {
    const createdUser = new this.userModel(userDto);
    const savedUser = await createdUser.save();
    delete savedUser.password;
    return savedUser;
  }

  async findOne(username: string): Promise<LeanDocument<user> & { _id: Types.ObjectId }> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByLogin(UserDTO: LoginUserDto): Promise<UserPayload> {
    const { username, password } = UserDTO;
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user)
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }
  sanitizeUser(user: userDocument): UserPayload {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }
  async validateUser(payload: LoginUserDto): Promise<userDocument | undefined> {
    const { username } = payload;
    return this.userModel.findOne({ username });
  }

  async signPayload(payload: {id: Types.ObjectId, username: string}) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '7d' });
  }
}
