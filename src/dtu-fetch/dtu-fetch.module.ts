import { Module } from '@nestjs/common';
import { DtuFetchService } from './dtu-fetch.service';
import { DtuFetchController } from './dtu-fetch.controller';
import { HttpModule } from '@nestjs/axios';
import { Hourly } from 'src/entitys/hourly.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Hourly]), HttpModule],
  providers: [DtuFetchService],
  controllers: [DtuFetchController],
  exports: [DtuFetchService],
})
export class DtuFetchModule {}
