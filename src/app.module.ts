import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongodbService } from "./mongodb/connection/mongodb.service";
import { Connection } from "mongoose";
import { user, userSchema } from "./mongodb/models/user.schema";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { getConfigs } from "./utils/getConfigs";
import { RoomsModule } from "./rooms/rooms.module";
import { UsersModule } from "./users/users.module";
import { SocketModule } from "./socket/socket.module";

@Module({
  imports: [
    ConfigModule.forRoot(getConfigs()),
    MongooseModule.forRootAsync({
      useClass: MongodbService,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: user.name, schema: userSchema }]),
    RoomsModule,
    UsersModule,
    SocketModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, Connection, AuthService],
})
export class AppModule {
  constructor(private connection: Connection) {
    this.logConnectionStatus();
  }

  private logConnectionStatus() {
    const db = this.connection;
    db.once("open", () => {
      console.log(`Successfully connected to MongoDB: ${db.name}`);
    });
    db.on("error", () => {
      console.error("MongoDB connection error");
    });
  }
}
