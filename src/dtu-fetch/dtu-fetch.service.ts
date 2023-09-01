import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DtuFetchService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('*/5 * * * * *')
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
    console.log(data.ch[0][2], data.ch[0][4]);
  }
}
