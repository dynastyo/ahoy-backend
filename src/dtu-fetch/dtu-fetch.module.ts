import { Module } from '@nestjs/common';
import { DtuFetchService } from './dtu-fetch.service';
import { DtuFetchController } from './dtu-fetch.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [DtuFetchService],
  controllers: [DtuFetchController],
  exports: [DtuFetchService],
})
export class DtuFetchModule {}
