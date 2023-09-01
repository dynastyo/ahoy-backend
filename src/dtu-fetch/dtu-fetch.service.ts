import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Hourly } from 'src/entitys/hourly.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DtuFetchService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Hourly)
    private readonly hourlyRepository: Repository<Hourly>,
  ) {}

  private maxAC: number = -Infinity; // Initializing with a very low value
  private minAC: number = Infinity; // Initializing with a very high value
  private dataList: number[] = []; // List to store the data
  private oldYield: number = 0;
  private currentYield: number = 0;

  @Cron('*/30 * * * * *')
  handleCron() {
    this.httpService
      .get('http://ahoy-dtu.8ekgr3b06mwu94rk.myfritz.net/api/inverter/id/0')
      .subscribe({
        next: (response) => {
          this.extractValue(response.data);
        },
        error: (err) => {
          console.error('Fehler beim Abrufen der Daten:', err);
        },
      });
  }

  extractValue(data: any): void {
    // Update maxAC and minAC
    if (data.ch[0][2] > this.maxAC) {
      this.maxAC = data.ch[0][2];
    }
    if (data.ch[0][2] < this.minAC) {
      this.minAC = data.ch[0][2];
    }

    this.currentYield = data.ch[0][7];

    // Append new data to the list
    this.dataList.push(data.ch[0][5]);

    // Log updated values (optional, for debugging purposes)
    console.log('Max AC:', this.maxAC);
    console.log('Min AC:', this.minAC);
    console.log('temperature:', this.dataList);
    console.log('current yield', this.currentYield);
  }

  @Cron('0 * * * *') // This runs every hour
  async saveToDatabase() {
    // Calculate the average of dataList
    const average =
      this.dataList.reduce((acc, curr) => acc + curr, 0) / this.dataList.length;

    // Create a new hourly and save
    const hourly = new Hourly();
    hourly.maxAC = this.maxAC;
    hourly.minAC = this.minAC;
    hourly.averageTemp = average;
    hourly.yield = this.currentYield - this.oldYield;
    await this.hourlyRepository.save(hourly);

    // Reset values
    this.maxAC = -Infinity;
    this.minAC = Infinity;
    this.dataList = [];
    this.oldYield = this.currentYield;
  }
}
