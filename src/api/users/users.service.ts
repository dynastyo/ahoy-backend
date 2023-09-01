import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from 'src/entitys/user.entity';
import { HttpService } from '@nestjs/axios';
import { Inverter } from 'src/entitys/inverter.entity';
import { Panel } from 'src/entitys/panel.entity';
import { response } from 'express';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private httpService: HttpService,
    private dataSource: DataSource,
  ) {}
  @InjectRepository(Inverter)
  private inverterRepository: Repository<Inverter>;

  @InjectRepository(Panel)
  private panelRepository: Repository<Panel>;

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(userData: Partial<User>): Promise<User> {
    console.log(userData);

    const user = this.usersRepository.create(userData);
    return await this.usersRepository.save(user);
  }

  async addUrl(id: number, url: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.url = url;
    return await this.usersRepository.save(user);
  }

  async updateInverterAndPanels(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const inverterListUrl = `${user.url}api/inverter/list`;
    this.httpService
      .get(inverterListUrl)
      .pipe(
        catchError((error) => {
          console.error('Error fetching inverter list:', error);
          throw new InternalServerErrorException(
            'Error fetching inverter list',
          );
        }),
      )
      //... other code

      .subscribe((response) => {
        const inverters = response.data.inverter;

        inverters.forEach((inverter) => {
          const newInverter = new Inverter();
          newInverter.name = inverter.name;
          newInverter.inverterId = inverter.id;
          newInverter.user = user; // Assuming you've set up relations correctly in your entities

          this.inverterRepository
            .save(newInverter) // Saving the inverter to DB
            .then((savedInverter) => {
              const inverterDataUrl = `${user.url}api/inverter/id/${inverter.id}`;

              this.httpService
                .get(inverterDataUrl)
                .pipe(
                  catchError((error) => {
                    console.error(
                      `Error fetching inverter data for ID ${inverter.id}:`,
                      error,
                    );
                    throw new InternalServerErrorException(
                      `Error fetching inverter data for ID ${inverter.id}`,
                    );
                  }),
                )
                .subscribe((panelResponse) => {
                  const panels = panelResponse.data.ch_name.slice(1); // skip the first entry

                  panels.forEach((panelName) => {
                    const newPanel = new Panel();
                    newPanel.name = panelName;
                    newPanel.inverter = savedInverter; // Relation to the saved inverter

                    this.panelRepository.save(newPanel); // Saving the panel to DB
                  });
                });
            })
            .catch((error) => {
              console.error('Error saving inverter:', error);
              throw new InternalServerErrorException('Error saving inverter');
            });
        });
      });
    //... other code
  }
}
