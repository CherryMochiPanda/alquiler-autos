import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationHour } from './entities/location-hour.entity';
import { Location } from './entities/location.entity';
import { CreateLocationHourDto } from './dto/create-location-hour.dto';
import { UpdateLocationHourDto } from './dto/update-location-hour.dto';

@Injectable()
export class LocationHourService {
  constructor(
    @InjectRepository(LocationHour)
    private readonly locationHourRepository: Repository<LocationHour>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(
    createLocationHourDto: CreateLocationHourDto,
  ): Promise<LocationHour> {
    // Validar dayOfWeek entre 0 y 6
    if (
      createLocationHourDto.dayOfWeek < 0 ||
      createLocationHourDto.dayOfWeek > 6
    ) {
      throw new BadRequestException(
        'dayOfWeek debe estar entre 0 (domingo) y 6 (sábado)',
      );
    }

    // Verificar que la ubicación exista
    const location = await this.locationRepository.findOne({
      where: { id: createLocationHourDto.locationId },
    });
    if (!location) {
      throw new BadRequestException('La ubicación especificada no existe');
    }

    // Verificar que no exista un horario para el mismo día en la misma ubicación
    const existingHour = await this.locationHourRepository.findOne({
      where: {
        location: { id: createLocationHourDto.locationId },
        dayOfWeek: createLocationHourDto.dayOfWeek,
      },
    });

    if (existingHour) {
      throw new BadRequestException(
        'Ya existe un horario para este día en esta ubicación',
      );
    }

    const locationHour = this.locationHourRepository.create({
      ...createLocationHourDto,
      location,
    });

    return this.locationHourRepository.save(locationHour);
  }

  async findAll(): Promise<LocationHour[]> {
    return this.locationHourRepository.find({
      relations: ['location'],
    });
  }

  async findByLocation(locationId: string): Promise<LocationHour[]> {
    return this.locationHourRepository.find({
      where: { location: { id: locationId } },
    });
  }

  async findOne(id: number): Promise<LocationHour> {
    const locationHour = await this.locationHourRepository.findOne({
      where: { id },
      relations: ['location'],
    });

    if (!locationHour) {
      throw new NotFoundException(`Horario con id ${id} no encontrado`);
    }

    return locationHour;
  }

  async update(
    id: number,
    updateLocationHourDto: UpdateLocationHourDto,
  ): Promise<LocationHour> {
    const locationHour = await this.findOne(id);

    // Validar dayOfWeek si se intenta cambiar
    if (
      updateLocationHourDto.dayOfWeek !== undefined &&
      (updateLocationHourDto.dayOfWeek < 0 ||
        updateLocationHourDto.dayOfWeek > 6)
    ) {
      throw new BadRequestException(
        'dayOfWeek debe estar entre 0 (domingo) y 6 (sábado)',
      );
    }

    Object.assign(locationHour, updateLocationHourDto);
    return this.locationHourRepository.save(locationHour);
  }

  async remove(id: number): Promise<void> {
    const locationHour = await this.findOne(id);
    await this.locationHourRepository.remove(locationHour);
  }
}
