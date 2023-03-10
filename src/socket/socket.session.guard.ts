import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { Socket } from "socket.io";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class SocketSessionGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log("SocketSession activated");
    const client = context?.switchToWs()?.getClient();
    return SocketSessionGuard.verifyToken(
      client,
      this.authService,
      client.handshake.headers["authorization"]
    );
  }

  static async verifyToken(
    socket: Socket,
    authService: AuthService,
    token?: string
  ) {
    if (!token) {
      throw new WsException("Unauthorized!");
    }

    const decodedToken = await authService.verifyToken(token);
    if (decodedToken) {
      if (decodedToken.username) {
        const user = await authService.findOne(decodedToken.username);
        if (!user) {
          throw new WsException("Unauthorized!");
        } else {
          socket.handshake.auth = user;
        }
      }
      return true;
    } else {
      throw new WsException("Unauthorized!");
    }
  }
}
