import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inverter } from './inverter.entity';

@Entity()
export class Panel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Inverter, (inverter) => inverter.panels)
  inverter: Inverter;
}
