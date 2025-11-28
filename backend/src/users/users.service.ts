import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Crear nuevo usuario: mapear campos del frontend a la entidad
    const fullName =
      `${createUserDto.firstName} ${createUserDto.lastName}`.trim();

    const user = this.userRepository.create({
      email: createUserDto.email,
      // Hash password before storing
      password: await bcrypt.hash(createUserDto.password, 10),
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      fullName,
      phoneNumber: createUserDto.phone,
      dni: createUserDto.dni,
      role: (createUserDto.role as string) || 'user',
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['rentals', 'reviews'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['rentals', 'reviews'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se intenta cambiar el email, verificar que no exista otro con ese email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('El email ya está registrado');
      }
    }

    // Si se actualizan nombres, reconstruir fullName
    if (updateUserDto.firstName !== undefined) {
      user.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      user.lastName = updateUserDto.lastName;
    }
    user.fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

    if (updateUserDto.phone !== undefined) {
      user.phoneNumber = updateUserDto.phone;
    }
    if (updateUserDto.dni !== undefined) {
      user.dni = updateUserDto.dni;
    }

    // Hash password on update if provided
    if (updateUserDto.password !== undefined) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Actualizar role si se proporciona
    if (updateUserDto.role !== undefined) {
      user.role = updateUserDto.role as string;
    }

    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
