import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
