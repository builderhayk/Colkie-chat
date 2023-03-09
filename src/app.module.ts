import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongodbService } from "./mongodb/mongodb/mongodb.service";
import { Connection } from "mongoose";
import { user, userSchema } from "./mongodb/mongodb/models/user.schema";
import { AuthModule } from './auth/auth.module';
import { AuthService } from "./auth/auth.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useClass: MongodbService,
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: user.name, schema: userSchema }]),
    AuthModule,
  ],
  controllers: [AppController],
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
