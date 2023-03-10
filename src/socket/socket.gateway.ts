import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayDisconnect,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { RoomsService } from "../rooms/rooms.service";
import { ChatService } from "../rooms/chat.service";
import { AuthService } from "../auth/auth.service";
import { UseGuards } from "@nestjs/common";
import { SocketSessionGuard } from "./socket.session.guard";
import { CreateMessageValidationSchema } from "../utils/validationSchemas/messages.validation.schema";
import { ObjectId } from "mongoose";

type activeUser = { id: string; username: string; socketConnection: Socket };
type activeRoom = { id: string; members: activeUser[] };

@WebSocketGateway({})
@UseGuards(SocketSessionGuard)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;
  connectedUsers: activeUser[] = [];
  activeRooms: activeRoom[] = [];
  constructor(
    private readonly roomsService: RoomsService,
    private readonly chatService: ChatService,
    private readonly authService: AuthService
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    const authToken = client.handshake.headers.authorization;
    if (!authToken) {
      client.disconnect();
      throw new WsException("Unauthorized");
    } else {
      const decodedToken = await this.authService.verifyToken(authToken);
      console.log("Connected", decodedToken);
      this.connectedUsers.push({
        id: decodedToken._id,
        username: decodedToken.username,
        socketConnection: client,
      });
    }
  }

  async handleDisconnect(client: Socket): Promise<void> {
    const userWasConnected =
      client.handshake.headers.authorization && client.handshake.auth;
    if (userWasConnected) {
      this.removeUserFromConnections(client.handshake.auth._id.toString());
    }
    client.disconnect();
  }

  @SubscribeMessage("joinRoom")
  async createRoom(client: Socket, payload: { roomId: string }) {
    const { roomId } = payload;
    const roomExists = await this.roomsService.getRoom(roomId);
    if (!roomExists) {
      return null;
    } else {
      client.join(roomId);
      const activeRoom = this.findActiveRoomById(roomExists._id.toString());
      const activeUser = this.findActiveUserById(
        client.handshake.auth._id.toString()
      );
      if (activeRoom) {
        if (
          !activeRoom.members.find(
            (user) => user.id === client.handshake.auth._id.toString()
          )
        ) {
          activeUser && activeRoom.members.push(activeUser);
        }
      } else {
        const membersArr = [];
        if (activeUser) {
          membersArr.push(activeUser);
        }
        this.activeRooms.push({
          id: roomExists._id.toString(),
          members: membersArr,
        });
      }

      return roomExists;
    }
  }

  @SubscribeMessage("sendMessageToRoom")
  async sendMessageToRoom(
    client: Socket,
    payload: CreateMessageValidationSchema & { roomId: string }
  ) {
    const newMessage = await this.chatService.createMessage({
      user: client.handshake.auth._id,
      room: payload.roomId,
      message: payload.message,
    });
    const activeRoom = this.findActiveRoomById(payload.roomId);
    if (activeRoom?.members.length) {
      activeRoom?.members.forEach((member) => {
        this.server
          .to(member.socketConnection.id)
          .emit("newMessage", newMessage);
      });
    }
  }

  @SubscribeMessage("addMemberToRoom")
  async addMemberToRoom(
    client: Socket,
    payload: { roomId: string; userId: string }
  ) {
    const roomWithMembers = await this.roomsService.addMemberToRoom({
      creatorId: client.handshake.auth._id,
      roomId: payload.roomId as unknown as ObjectId,
      userId: payload.userId as unknown as ObjectId,
    });
    const activeRoom = this.findActiveRoomById(payload.roomId);
    if (activeRoom?.members.length) {
      activeRoom?.members.forEach((member) => {
        this.server
          .to(member.socketConnection.id)
          .emit("newUserAdded", roomWithMembers);
      });
    }
    const activeUser = this.findActiveUserById(payload.userId);
    if (activeUser) {
      this.server
        .to(activeUser.socketConnection.id)
        .emit("hasBeenAddedToRoom", roomWithMembers);
    }
  }

  findActiveUserById(userId: string): activeUser {
    return this.connectedUsers.find((user) => user.id === userId);
  }

  findActiveRoomById(roomId: string) {
    return this.activeRooms.find((room) => room.id === roomId);
  }

  removeUserFromConnections(userId: string): void {
    this.connectedUsers.filter(({ id }) => {
      return id !== userId;
    });
    this.activeRooms.forEach((room) => {
      const userInRoom = room.members.find((member) => member.id === userId);
      if (userInRoom) {
        room.members = room.members.filter((user) => user.id !== userId);
      }
    });
  }
}
