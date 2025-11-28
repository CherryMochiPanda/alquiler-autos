import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Location } from '../../location/entities/location.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ej: 'La Habana', 'Pinar del Río'

  // Relación 1:N: Una provincia tiene muchos locales.
  @OneToMany(() => Location, (location) => location.province)
  locations: Location[];
}
