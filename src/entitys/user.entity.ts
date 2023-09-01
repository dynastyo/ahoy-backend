import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Inverter } from './inverter.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @OneToMany(() => Inverter, (inverter) => inverter.user)
  inverters: Inverter[];
}
