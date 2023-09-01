import { Controller } from '@nestjs/common';
import { DtuFetchService } from './dtu-fetch.service';

@Controller('hello')
export class DtuFetchController {
  constructor(private readonly helloService: DtuFetchService) {}
}
