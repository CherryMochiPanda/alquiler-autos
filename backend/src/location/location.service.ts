import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { Province } from '../province/entities/province.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    // Verificar que la provincia exista
    const province = await this.provinceRepository.findOne({
      where: { id: createLocationDto.provinceId },
    });

    if (!province) {
      throw new BadRequestException('La provincia especificada no existe');
    }

    const location = this.locationRepository.create({
      ...createLocationDto,
      province,
    });

    return this.locationRepository.save(location);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({
      relations: ['province', 'hours', 'inventory'],
    });
  }

  async findOne(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['province', 'hours', 'inventory'],
    });

    if (!location) {
      throw new NotFoundException(`Ubicación con id ${id} no encontrada`);
    }

    return location;
  }

  async findByProvince(provinceId: number): Promise<Location[]> {
    return this.locationRepository.find({
      where: { province: { id: provinceId } },
      relations: ['hours', 'inventory'],
    });
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id);

    // Si se cambia la provincia, verificar que exista
    if (
      updateLocationDto.provinceId &&
      updateLocationDto.provinceId !== location.province.id
    ) {
      const province = await this.provinceRepository.findOne({
        where: { id: updateLocationDto.provinceId },
      });
      if (!province) {
        throw new BadRequestException('La provincia especificada no existe');
      }
      location.province = province;
    }

    Object.assign(location, updateLocationDto);
    return this.locationRepository.save(location);
  }

  async remove(id: string): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);
  }
}
