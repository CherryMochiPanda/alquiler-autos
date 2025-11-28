import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Province } from '../../province/entities/province.entity';
import { LocationHour } from './location-hour.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // Ej: 'Aeropuerto José Martí'

  @Column()
  address: string;

  // Relación N:1 a la Provincia
  @ManyToOne(() => Province, (province) => province.locations)
  province: Province;

  // Relación 1:N a Horarios (Relación a LocationHour)
  @OneToMany(() => LocationHour, (hour) => hour.location)
  hours: LocationHour[];

  // Relación 1:N a Inventario (Relación a Inventory)
  @OneToMany(() => Inventory, (inventory) => inventory.location)
  inventory: Inventory[];
}
