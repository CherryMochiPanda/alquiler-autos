import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Rental } from '../../rentals/entities/rental.entity';
import { Review } from '../../review/entities/review.entity';
import { Category } from '../../category/entities/category.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column('int')
  year: number;

  @Column('decimal')
  pricePerDay: number;

  @Column({ unique: true })
  plate: string;

  @Column({ default: true })
  isAvailable: boolean;

  // Relación N:1 a Categoría
  @ManyToOne(() => Category, (category) => category.cars)
  category: Category;

  // Relación 1:N a Rentas
  @OneToMany(() => Rental, (rental) => rental.car)
  rentals: Rental[];

  // Relación 1:N a Reseñas
  @OneToMany(() => Review, (review) => review.car)
  reviews: Review[];

  // Relación 1:N a Inventario
  @OneToMany(() => Inventory, (inventory) => inventory.car)
  inventory: Inventory[];
}
