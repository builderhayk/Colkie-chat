import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { roomDocument } from "../mongodb/mongodb/models/room.schema";
import { AuthGuard } from "@nestjs/passport";
import { ChatService } from "./chat.service";
import { chatDocument } from "../mongodb/mongodb/models/chat.schema";
import {
  AddMemberToRoomValidationSchema,
  CreateRoomValidationSchema,
  GetPaginatedListValidationSchema,
  RoomIdValidationSchema
} from "../dtos/room";
import { CreateMessageValidationSchema } from "../dtos/chat";

@Controller("rooms")
export class RoomsController {
  constructor(
    private roomsService: RoomsService,
    private chatService: ChatService
  ) {}

  @Post()
  @UseGuards(AuthGuard("jwt"))
  async createRoom(
    @Request() req,
    @Body() body: CreateRoomValidationSchema
  ): Promise<roomDocument> {
    return this.roomsService.createRoom(req.user._id || req.user.id, req.user._id, body.name);
  }

  @Get(":roomId")
  @UseGuards(AuthGuard("jwt"))
  async getRoom(
    @Param() params: RoomIdValidationSchema
  ): Promise<roomDocument> {
    return this.roomsService.getRoom(params.roomId);
  }

  @Get("list")
  @UseGuards(AuthGuard("jwt"))
  async getRooms(
    @Param() req,
    @Param() param: GetPaginatedListValidationSchema,
    @Query() query: GetPaginatedListValidationSchema
  ): Promise<roomDocument[]> {
    return this.roomsService.getUserRooms(
      req.user._id,
      query.page,
      query.limit
    );
  }

  @Post(":roomId/messages")
  @UseGuards(AuthGuard("jwt"))
  async createMessage(
    @Request() req,
    @Body() body: CreateMessageValidationSchema,
    @Param() param: RoomIdValidationSchema
  ): Promise<chatDocument> {
    return this.chatService.createMessage({
      message: body.message,
      user: req.user.id,
      room: param.roomId,
    });
  }

  @Get(":roomId/messages")
  @UseGuards(AuthGuard("jwt"))
  async getRoomMessages(
    @Param() param: RoomIdValidationSchema,
    @Query() query: GetPaginatedListValidationSchema
  ): Promise<chatDocument[]> {
    return this.chatService.getRoomMessages(
      param.roomId,
      query.page,
      query.limit
    );
  }

  @Post(":roomId/addMember/:userId")
  @UseGuards(AuthGuard("jwt"))
  async addMemberToRoom(
    @Request() req,
    @Param() param: AddMemberToRoomValidationSchema
  ): Promise<roomDocument> {
    return this.roomsService.addMemberToRoom({
      creatorId: req.user._id,
      userId: param.userId,
      roomId: param.roomId
    });
  }
}
