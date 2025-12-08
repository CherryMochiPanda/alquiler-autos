import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';
import { User } from '../users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';
import { Location } from '../location/entities/location.entity';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private readonly rentalRepository: Repository<Rental>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createRentalDto: CreateRentalDto): Promise<Rental> {
    // Verificar que el usuario exista
    const user = await this.userRepository.findOne({
      where: { id: createRentalDto.userId },
    });
    if (!user) {
      throw new BadRequestException('El usuario especificado no existe');
    }

    // Verificar que el coche exista
    const car = await this.carRepository.findOne({
      where: { id: createRentalDto.carId },
    });
    if (!car) {
      throw new BadRequestException('El coche especificado no existe');
    }

    // Verificar que el coche esté disponible
    if (!car.isAvailable) {
      throw new BadRequestException('El coche no está disponible');
    }

    // Verificar que las ubicaciones existan
    const pickupLocation = await this.locationRepository.findOne({
      where: { id: createRentalDto.pickupLocationId },
    });
    if (!pickupLocation) {
      throw new BadRequestException('La ubicación de recogida no existe');
    }

    const dropoffLocation = await this.locationRepository.findOne({
      where: { id: createRentalDto.dropoffLocationId },
    });
    if (!dropoffLocation) {
      throw new BadRequestException('La ubicación de entrega no existe');
    }

    // Verificar si ya existe una renta que se solape en las fechas
    const overlappingRental = await this.rentalRepository
      .createQueryBuilder('rental')
      .where('rental.carId = :carId', { carId: createRentalDto.carId })
      .andWhere(
        '(rental.status IN (:activeStatuses))', // Solo rentas activas o pendientes
        { activeStatuses: ['PENDING', 'ACTIVE'] },
      )
      .andWhere(
        // Condición de Solapamiento: [A, B] y [C, D] se solapan si A <= D y C <= B
        '(:startDate < rental.endDate AND rental.startDate < :endDate)',
        {
          startDate: createRentalDto.startDate,
          endDate: createRentalDto.endDate,
        },
      )
      .getOne();

    if (overlappingRental) {
      throw new BadRequestException(
        'El coche ya está reservado durante las fechas seleccionadas.',
      );
    }

    // Validar que la fecha de inicio sea al menos 24h en el futuro
    const now = new Date();
    const startDate = new Date(createRentalDto.startDate);
    const hoursUntilStart =
      (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilStart < 24) {
      throw new BadRequestException(
        'La fecha de inicio debe ser al menos 24 horas en el futuro',
      );
    }

    // Validar que la fecha de fin sea al menos 72h después del inicio
    const endDate = new Date(createRentalDto.endDate);
    //VALIDAR DURACIÓN BÁSICA (End debe ser posterior a Start)
    if (startDate >= endDate) {
      throw new BadRequestException(
        'La fecha de fin debe ser posterior a la fecha de inicio.',
      );
    }
    const hoursDifference =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 72) {
      throw new BadRequestException('La renta debe ser de al menos 72 horas');
    }

    // Calcular precio total si no se proporcionó
    let totalPrice = createRentalDto.totalPrice;
    if (!totalPrice) {
      const days = Math.ceil(hoursDifference / 24);
      const driverCost = createRentalDto.hasDriver ? days * 50 : 0; // $50 por día del conductor
      totalPrice = Number(car.pricePerDay) * days + driverCost;
    }

    const rental = this.rentalRepository.create({
      ...createRentalDto,
      totalPrice,
      user,
      car,
      pickupLocation,
      dropoffLocation,
      status: 'PENDING',
      hasDriver: createRentalDto.hasDriver || false,
    });

    return this.rentalRepository.save(rental);
  }

  async findAll(): Promise<Rental[]> {
    return this.rentalRepository.find({
      relations: ['user', 'car', 'pickupLocation', 'dropoffLocation'],
    });
  }

  async findOne(id: string): Promise<Rental> {
    const rental = await this.rentalRepository.findOne({
      where: { id },
      relations: ['user', 'car', 'pickupLocation', 'dropoffLocation'],
    });

    if (!rental) {
      throw new NotFoundException(`Renta con id ${id} no encontrada`);
    }

    return rental;
  }

  async findByUser(userId: string): Promise<Rental[]> {
    return this.rentalRepository.find({
      where: { user: { id: userId } },
      relations: ['car', 'pickupLocation', 'dropoffLocation'],
    });
  }

  async findByStatus(status: string): Promise<Rental[]> {
    return this.rentalRepository.find({
      where: { status },
      relations: ['user', 'car', 'pickupLocation', 'dropoffLocation'],
    });
  }

  async update(id: string, updateRentalDto: UpdateRentalDto): Promise<Rental> {
    const rental = await this.findOne(id);

    // No permitir cambiar usuario o coche
    if (updateRentalDto.userId || updateRentalDto.carId) {
      throw new BadRequestException(
        'No se puede cambiar el usuario o el coche de una renta existente',
      );
    }

    // Si se intenta cambiar fechas, validar
    if (updateRentalDto.startDate || updateRentalDto.endDate) {
      const startDate = updateRentalDto.startDate
        ? new Date(updateRentalDto.startDate)
        : rental.startDate;
      const endDate = updateRentalDto.endDate
        ? new Date(updateRentalDto.endDate)
        : rental.endDate;

      const hoursDifference =
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

      if (hoursDifference < 72) {
        throw new BadRequestException('La renta debe ser de al menos 72 horas');
      }
    }

    Object.assign(rental, updateRentalDto);
    return this.rentalRepository.save(rental);
  }

  async updateStatus(id: string, status: string): Promise<Rental> {
    const rental = await this.findOne(id);

    const validStatuses = ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(
        'Estado de renta inválido. Valores válidos: PENDING, ACTIVE, COMPLETED, CANCELLED',
      );
    }

    rental.status = status;
    return this.rentalRepository.save(rental);
  }

  async remove(id: string): Promise<void> {
    const rental = await this.findOne(id);
    await this.rentalRepository.remove(rental);
  }
}
