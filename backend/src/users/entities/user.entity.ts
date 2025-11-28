import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rental } from '../../rentals/entities/rental.entity';
import { Review } from '../../review/entities/review.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true, unique: false })
  dni?: string;

  @Column({ default: 'user' })
  role: string; // 'admin' | 'user'

  // Relación 1:N con Rentas
  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  // Relación 1:N con Reseñas
  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];
}
