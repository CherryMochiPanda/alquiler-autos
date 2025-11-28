import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Location } from './location.entity';

@Entity('location_hours')
export class LocationHour {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: number; // 0=Domingo, 1=Lunes, etc.

  @Column({ type: 'time' })
  openTime: string;

  @Column({ type: 'time' })
  closeTime: string;

  @ManyToOne(() => Location, (location) => location.hours)
  location: Location;
}
