import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { AuthGuard } from "@nestjs/passport";
import { GetPaginatedListValidationSchema } from "../utils/validationSchemas/paginatedList.validation.schema";
import { PaginatedListResponseData } from "../dtos/shared";
import { userDocument } from "../mongodb/models/user.schema";

@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard("jwt"))
  async getUsers(
    @Query() query: GetPaginatedListValidationSchema
  ): Promise<PaginatedListResponseData<userDocument>> {
    return this.usersService.getUsers(query.search, query.page, query.limit);
  }
}
