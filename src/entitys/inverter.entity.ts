import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Panel } from './panel.entity';

@Entity()
export class Inverter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  inverterId: string;

  @ManyToOne(() => User, (user) => user.inverters)
  user: User;

  @OneToMany(() => Panel, (panel) => panel.inverter)
  panels: Panel[];
}
