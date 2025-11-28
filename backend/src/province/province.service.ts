import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    // Verificar que el nombre sea único
    const existingProvince = await this.provinceRepository.findOne({
      where: { name: createProvinceDto.name },
    });

    if (existingProvince) {
      throw new BadRequestException('La provincia ya existe');
    }

    const province = this.provinceRepository.create(createProvinceDto);
    return this.provinceRepository.save(province);
  }

  async findAll(): Promise<Province[]> {
    return this.provinceRepository.find({
      relations: ['locations'],
    });
  }

  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({
      where: { id },
      relations: ['locations'],
    });

    if (!province) {
      throw new NotFoundException(`Provincia con id ${id} no encontrada`);
    }

    return province;
  }

  async update(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    const province = await this.findOne(id);

    // Si se intenta cambiar el nombre, verificar que no exista otra con ese nombre
    if (updateProvinceDto.name && updateProvinceDto.name !== province.name) {
      const existingProvince = await this.provinceRepository.findOne({
        where: { name: updateProvinceDto.name },
      });
      if (existingProvince) {
        throw new BadRequestException('La provincia ya existe');
      }
    }

    Object.assign(province, updateProvinceDto);
    return this.provinceRepository.save(province);
  }

  async remove(id: number): Promise<void> {
    const province = await this.findOne(id);
    await this.provinceRepository.remove(province);
  }
}
