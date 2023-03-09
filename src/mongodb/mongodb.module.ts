import { Module } from '@nestjs/common';
import { MongodbService } from './mongodb/mongodb.service';
import { Connection } from "mongoose";
import { userSchema } from "./mongodb/models/user.schema";

@Module({
  imports: [],
  providers: [
    MongodbService,
    {
      provide: 'USER_MODEL',
      useFactory: (connection: Connection) => connection.model('ChatMessage', userSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  exports: [
    {
      provide: 'USER_MODEL',
      useFactory: (connection: Connection) => connection.model('ChatMessage', userSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ]
})
export class MongodbModule {}
