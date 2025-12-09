/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
  Query,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RentalsService } from '../rentals/rentals.service';
import { CarsService } from '../cars/cars.service';

interface RequestUser {
  id: string;
  email: string;
  role: string;
}

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly rentalsService: RentalsService,
    private readonly carsService: CarsService,
  ) {}

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
  async getStats(
    @Query('type') type?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const users = await this.usersService.findAll();
    const admins = (users as any[]).filter((u) => u.role === 'admin').length;

    // Base stats
    const cars = await this.carsService.findAll();
    const allRentals = await this.rentalsService.findAll();

    const stats: any = {
      totalUsers: users.length,
      totalAdmins: admins,
      totalCars: Array.isArray(cars) ? cars.length : 0,
      totalReservations: Array.isArray(allRentals) ? allRentals.length : 0,
    };

    // If no specific type requested, return basic stats
    if (!type) {
      return { success: true, stats };
    }

    // Parse range
    const fromDate = from ? new Date(from) : null;
    const toDate = to ? new Date(to) : null;

    // Filter rentals by date range if provided (by startDate)
    const filtered = allRentals.filter((r) => {
      if (!r.startDate) return false;
      const sd = new Date(r.startDate);
      if (fromDate && sd < fromDate) return false;
      if (toDate && sd > toDate) return false;
      return true;
    });

    if (type === 'revenue') {
      const total = filtered.reduce(
        (acc, r: any) => acc + (parseFloat(r.totalPrice || r.total || 0) || 0),
        0,
      );
      // Return sanitized list (no PII)
      const items = filtered.map((r: any) => ({
        id: r.id,
        carId: r.car?.id,
        carName:
          r.car?.brand && r.car?.model
            ? `${r.car.brand} ${r.car.model}`
            : r.car?.id,
        startDate: r.startDate,
        endDate: r.endDate,
        totalPrice: r.totalPrice || r.total || 0,
        status: r.status,
      }));
      return { success: true, stats: { ...stats, totalRevenue: total }, items };
    }

    if (type === 'top_cars') {
      const counts: Record<string, number> = {};
      for (const r of filtered) {
        const id = r.car?.id || 'unknown';
        counts[id] = (counts[id] || 0) + 1;
      }
      const items = Object.keys(counts)
        .map((id) => {
          const car = Array.isArray(cars)
            ? cars.find((c: any) => c.id === id)
            : undefined;
          const carName = car && car.brand ? `${car.brand} ${car.model}` : id;
          return { carId: id, carName, count: counts[id] };
        })
        .sort((a, b) => b.count - a.count);
      return { success: true, stats, items };
    }

    if (type === 'utilization') {
      // compute occupied days per car in range
      function daysOverlap(
        aStart: string | Date,
        aEnd: string | Date,
        rangeStart?: Date,
        rangeEnd?: Date,
      ) {
        const startA = new Date(aStart as any);
        const endA = new Date(aEnd as any);
        const s1 = startA.setHours(0, 0, 0, 0);
        const e1 = endA.setHours(23, 59, 59, 999);
        const s2 = rangeStart
          ? new Date(rangeStart).setHours(0, 0, 0, 0)
          : -8640000000000000;
        const e2 = rangeEnd
          ? new Date(rangeEnd).setHours(23, 59, 59, 999)
          : 8640000000000000;
        const s = Math.max(s1, s2);
        const e = Math.min(e1, e2);
        if (e < s) return 0;
        return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
      }
      const occupied: Record<string, number> = {};
      for (const r of filtered) {
        const id = r.car?.id || 'unknown';
        occupied[id] =
          (occupied[id] || 0) +
          daysOverlap(
            r.startDate,
            r.endDate,
            fromDate || undefined,
            toDate || undefined,
          );
      }
      const items = Object.keys(occupied).map((id) => {
        const car = Array.isArray(cars)
          ? cars.find((c: any) => c.id === id)
          : undefined;
        const carName = car && car.brand ? `${car.brand} ${car.model}` : id;
        return { carId: id, carName, occupiedDays: occupied[id] };
      });
      return { success: true, stats, items };
    }

    // Unknown type
    return { success: false, error: 'Tipo de reporte desconocido' };
  }
}
