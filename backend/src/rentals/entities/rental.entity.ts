import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';
import { Location } from '../../location/entities/location.entity';

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  startDate: Date; // Fecha y hora de recogida (Mínimo 24h de antelación)

  @Column({ type: 'timestamp' })
  endDate: Date; // Fecha y hora de entrega (Mínimo 72h después de recogida)

  @Column('decimal', { precision: 10, scale: 2 }) // Total de 10 dígitos, 2 decimales
  totalPrice: number;

  @Column({ default: 'PENDING' })
  status: string; // PENDING, ACTIVE, COMPLETED, CANCELLED

  @Column({ default: false })
  hasDriver: boolean; // ¿El cliente desea contratar un conductor?

  // Relación N:1 a User
  @ManyToOne(() => User, (user) => user.rentals, { onDelete: 'CASCADE' })
  user: User;

  // Relación N:1 a Car
  @ManyToOne(() => Car, (car) => car.rentals)
  car: Car;

  // Relación N:1 a Location (Lugar de Recogida)
  @ManyToOne(() => Location, { eager: true })
  pickupLocation: Location;

  // Relación N:1 a Location (Lugar de Entrega/Drop-off)
  @ManyToOne(() => Location, { eager: true })
  dropoffLocation: Location;
}
