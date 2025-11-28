import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { Location } from '../../location/entities/location.entity';

@Entity('inventory')
export class Inventory {
  // Claves compuestas para la tabla N:M
  @PrimaryColumn()
  carId: string;

  @PrimaryColumn()
  locationId: string;

  @Column('int', { default: 0 })
  stock: number; // Cantidad de unidades disponibles en ese local

  // Relación N:1 con Car
  @ManyToOne(() => Car, (car) => car.inventory)
  car: Car;

  // Relación N:1 con Location
  @ManyToOne(() => Location, (location) => location.inventory)
  location: Location;
}
