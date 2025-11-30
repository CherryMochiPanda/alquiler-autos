import {
  Controller,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface RequestUser {
  id: string;
  email: string;
  role: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Obtiene lista de todos los usuarios (sin passwords)
   */
  @Get('users')
  async getUsers() {
    const users = await this.usersService.findAll();
    // Remover passwords
    const safeUsers = users.map((user: any) => {
      const { password, ...safeUser } = user;
      return safeUser;
    });
    return { success: true, users: safeUsers };
  }

  /**
   * Obtiene un usuario por ID
   */
  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    const { password, ...safeUser } = user as any;
    return { success: true, user: safeUser };
  }

  /**
   * Elimina un usuario (no permitir eliminar al admin actual)
   */
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Req() req: any) {
    const currentUser: RequestUser = req.user;

    // Prevenir que el admin actual se elimine a sí mismo
    if (currentUser.id === id) {
      throw new ForbiddenException('No puedes eliminar tu propio usuario');
    }

    await this.usersService.remove(id);
    return { success: true, message: 'Usuario eliminado' };
  }

  /**
   * Actualiza rol de usuario (cambiar a admin o revocar admin)
   * No permitir que el admin actual se revoque a sí mismo
   */
  @Patch('users/:id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: { role: string },
    @Req() req: any,
  ) {
    const currentUser: RequestUser = req.user;
    const validRoles = ['admin', 'user'];

    // Validate role value
    if (!validRoles.includes(body.role)) {
      throw new ForbiddenException('Invalid role value. Must be admin or user');
    }

    // Prevenir que el admin se revoque a sí mismo
    if (currentUser.id === id && body.role !== 'admin') {
      throw new ForbiddenException(
        'No puedes quitarte el rol de administrador',
      );
    }

    const typedRole = body.role as 'admin' | 'user';
    const updatedUser = await this.usersService.update(id, {
      role: typedRole,
    });
    const { password, ...safeUser } = updatedUser as any;
    return { success: true, user: safeUser };
  }

  /**
   * Obtiene estadísticas del sistema
   */
  @Get('stats')
  async getStats() {
    const users = await this.usersService.findAll();
    const admins = (users as any[]).filter((u) => u.role === 'admin').length;

    return {
      success: true,
      stats: {
        totalUsers: users.length,
        totalAdmins: admins,
        totalCars: 0,
        totalReservations: 0,
      },
    };
  }
}
