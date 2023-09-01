import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../../entitys/user.entity';
import { HttpModule } from '@nestjs/axios';
import { Inverter } from 'src/entitys/inverter.entity';
import { Panel } from 'src/entitys/panel.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Inverter, Panel]), HttpModule],
  exports: [TypeOrmModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
