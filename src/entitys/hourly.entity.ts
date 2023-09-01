import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Hourly {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('float')
  maxAC: number;

  @Column('float')
  minAC: number;

  @Column('float')
  yield: number;

  @Column('float')
  averageTemp: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
