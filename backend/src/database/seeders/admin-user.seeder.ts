import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminUserSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    // Check if admin user already exists
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@correo.com' },
    });

    if (adminExists) {
      console.log('Admin user already exists, skipping seed');
      return;
    }

    // Create admin user with hashed password
    const adminPassword = await bcrypt.hash('Admin123456', 10);

    const adminUser = this.userRepository.create({
      email: 'admin@correo.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Usuario',
      fullName: 'Admin Usuario',
      dni: '00000000001',
      role: 'admin',
    });

    await this.userRepository.save(adminUser);
    console.log('✓ Admin user seeded successfully');
  }
}
