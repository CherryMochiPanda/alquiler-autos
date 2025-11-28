import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './entities/car.entity';
import { Category } from '../category/entities/category.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    // Verificar que la placa sea única
    const existingCar = await this.carRepository.findOne({
      where: { plate: createCarDto.plate },
    });

    if (existingCar) {
      throw new BadRequestException('La placa del coche ya existe');
    }

    // Verificar que la categoría exista
    const category = await this.categoryRepository.findOne({
      where: { id: createCarDto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('La categoría especificada no existe');
    }

    const car = this.carRepository.create({
      ...createCarDto,
      category,
      isAvailable: createCarDto.isAvailable !== false,
    });

    return this.carRepository.save(car);
  }

  async findAll(): Promise<Car[]> {
    return this.carRepository.find({
      relations: ['category', 'rentals', 'reviews', 'inventory'],
    });
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['category', 'rentals', 'reviews', 'inventory'],
    });

    if (!car) {
      throw new NotFoundException(`Coche con id ${id} no encontrado`);
    }

    return car;
  }

  async findAvailable(): Promise<Car[]> {
    return this.carRepository.find({
      where: { isAvailable: true },
      relations: ['category', 'inventory'],
    });
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findOne(id);

    // Si se intenta cambiar la placa, verificar que no exista otro con esa placa
    if (updateCarDto.plate && updateCarDto.plate !== car.plate) {
      const existingCar = await this.carRepository.findOne({
        where: { plate: updateCarDto.plate },
      });
      if (existingCar) {
        throw new BadRequestException('La placa del coche ya existe');
      }
    }

    // Si se cambia la categoría, verificar que exista
    if (updateCarDto.categoryId && updateCarDto.categoryId !== car.category.id) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateCarDto.categoryId },
      });
      if (!category) {
        throw new BadRequestException('La categoría especificada no existe');
      }
      car.category = category;
    }

    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async remove(id: string): Promise<void> {
    const car = await this.findOne(id);
    await this.carRepository.remove(car);
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<Car> {
    const car = await this.findOne(id);
    car.isAvailable = isAvailable;
    return this.carRepository.save(car);
  }
}
