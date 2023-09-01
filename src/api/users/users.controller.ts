import { Body, Controller, Param, Post } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from 'src/entitys/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('addUser')
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Post('addUrl/:userId')
  async addUrl(
    @Param('userId') userId: number,
    @Body('url') url: string,
  ): Promise<User> {
    return this.usersService.addUrl(userId, url);
  }

  @Post('updateInverterAndPanels')
  async updateInverterAndPanels(@Body('userId') userId: number): Promise<void> {
    return await this.usersService.updateInverterAndPanels(userId);
  }
}
