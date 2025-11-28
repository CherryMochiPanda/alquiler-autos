import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Car } from '../cars/entities/car.entity';
import { Location } from '../location/entities/location.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    // Verificar que el coche exista
    const car = await this.carRepository.findOne({
      where: { id: createInventoryDto.carId },
    });
    if (!car) {
      throw new BadRequestException('El coche especificado no existe');
    }

    // Verificar que la ubicación exista
    const location = await this.locationRepository.findOne({
      where: { id: createInventoryDto.locationId },
    });
    if (!location) {
      throw new BadRequestException('La ubicación especificada no existe');
    }

    // Verificar si ya existe un registro de inventario para este coche y ubicación
    const existingInventory = await this.inventoryRepository.findOne({
      where: {
        carId: createInventoryDto.carId,
        locationId: createInventoryDto.locationId,
      },
    });

    if (existingInventory) {
      throw new BadRequestException(
        'Ya existe un registro de inventario para este coche y ubicación',
      );
    }

    const inventory = this.inventoryRepository.create({
      ...createInventoryDto,
      car,
      location,
    });

    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      relations: ['car', 'location'],
    });
  }

  async findByLocation(locationId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { locationId },
      relations: ['car'],
    });
  }

  async findByCar(carId: string): Promise<Inventory[]> {
    return this.inventoryRepository.find({
      where: { carId },
      relations: ['location'],
    });
  }

  async findOne(carId: string, locationId: string): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { carId, locationId },
      relations: ['car', 'location'],
    });

    if (!inventory) {
      throw new NotFoundException(
        `Inventario no encontrado para el coche ${carId} en la ubicación ${locationId}`,
      );
    }

    return inventory;
  }

  async update(
    carId: string,
    locationId: string,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.findOne(carId, locationId);

    Object.assign(inventory, updateInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async updateStock(
    carId: string,
    locationId: string,
    stock: number,
  ): Promise<Inventory> {
    const inventory = await this.findOne(carId, locationId);
    inventory.stock = Math.max(0, stock); // No permitir stock negativo
    return this.inventoryRepository.save(inventory);
  }

  async decreaseStock(carId: string, locationId: string): Promise<Inventory> {
    const inventory = await this.findOne(carId, locationId);

    if (inventory.stock <= 0) {
      throw new BadRequestException(
        'Stock insuficiente para este coche en esta ubicación',
      );
    }

    inventory.stock -= 1;
    return this.inventoryRepository.save(inventory);
  }

  async increaseStock(carId: string, locationId: string): Promise<Inventory> {
    const inventory = await this.findOne(carId, locationId);
    inventory.stock += 1;
    return this.inventoryRepository.save(inventory);
  }

  async remove(carId: string, locationId: string): Promise<void> {
    const inventory = await this.findOne(carId, locationId);
    await this.inventoryRepository.remove(inventory);
  }
}
