import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DtuFetchModule } from './dtu-fetch/dtu-fetch.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UsersModule } from './api/users/users.module';
import { User } from './entitys/user.entity';
import { Inverter } from './entitys/inverter.entity';
import { Panel } from './entitys/panel.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ahoy',
      entities: [User, Inverter, Panel],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    DtuFetchModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
