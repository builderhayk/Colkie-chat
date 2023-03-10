import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { user, userDocument } from "../mongodb/models/user.schema";
import { FilterQuery, Model } from "mongoose";
import { PaginatedListResponseData } from "../dtos/shared";

@Injectable()
export class UsersService {
  constructor(@InjectModel(user.name) private userModel: Model<userDocument>) {}

  async getUsers(
    search: string = "",
    page = 1,
    limit = 10
  ): Promise<PaginatedListResponseData<userDocument>> {
    const searchQuery: FilterQuery<{ [key in string]: any }> = {};
    if (search) {
      searchQuery.$or = [
        { username: { $regex: new RegExp(search, "i") } },
        { fullName: { $regex: new RegExp(search, "i") } },
      ];
    }
    const usersData = await this.userModel
      .find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const usersCount = await this.userModel.count(searchQuery);
    return {
      count: usersCount,
      data: usersData,
    };
  }
}
