import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // Ej: 'Lujo', 'Económico'

  @OneToMany(() => Car, (car) => car.category)
  cars: Car[];
}
