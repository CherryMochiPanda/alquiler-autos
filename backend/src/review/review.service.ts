import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { User } from '../users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    // Validar rating entre 1 y 5
    if (createReviewDto.rating < 1 || createReviewDto.rating > 5) {
      throw new BadRequestException('La calificación debe estar entre 1 y 5');
    }

    // Verificar que el usuario exista
    const user = await this.userRepository.findOne({
      where: { id: createReviewDto.userId },
    });
    if (!user) {
      throw new BadRequestException('El usuario especificado no existe');
    }

    // Verificar que el coche exista
    const car = await this.carRepository.findOne({
      where: { id: createReviewDto.carId },
    });
    if (!car) {
      throw new BadRequestException('El coche especificado no existe');
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      car,
    });

    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['user', 'car'],
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['user', 'car'],
    });

    if (!review) {
      throw new NotFoundException(`Resena con id ${id} no encontrada`);
    }

    return review;
  }

  async findByCar(carId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { car: { id: carId } },
      relations: ['user'],
    });
  }

  async findByUser(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user: { id: userId } },
      relations: ['car'],
    });
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);

    // Validar rating si se intenta cambiar
    if (
      updateReviewDto.rating &&
      (updateReviewDto.rating < 1 || updateReviewDto.rating > 5)
    ) {
      throw new BadRequestException('La calificación debe estar entre 1 y 5');
    }

    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
