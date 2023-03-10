import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from "@nestjs/mongoose";

@Injectable()
export class MongodbService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    const host = this.configService.get<string>("MONGODB_HOST");
    const port = this.configService.get<number>("MONGODB_PORT");
    const db_name = this.configService.get<string>("MONGODB_DATABASE");
    return {
      uri: `mongodb://${host}:${port}/${db_name}`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }
}
