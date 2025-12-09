/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/cars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(@UploadedFile() file: any, @Body() createCarDto: CreateCarDto) {
    const imagePath =
      file && file.filename ? `/uploads/cars/${file.filename}` : undefined;
    return this.carsService.create({ ...createCarDto, image: imagePath });
  }

  @Get()
  findAll() {
    return this.carsService.findAll();
  }

  @Get('available')
  findAvailable() {
    return this.carsService.findAvailable();
  }

  @Get('featured')
  findFeatured(@Query('limit') limit?: string) {
    const n = limit ? parseInt(limit, 10) : undefined;
    return this.carsService.findFeatured(n);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/cars',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\.(jpg|jpeg|png|webp)$/)) {
          return cb(new Error('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: any,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    const imagePath =
      file && file.filename ? `/uploads/cars/${file.filename}` : undefined;
    return this.carsService.update(id, { ...updateCarDto, image: imagePath });
  }

  @Patch(':id/availability')
  updateAvailability(
    @Param('id') id: string,
    @Body() body: { isAvailable: boolean },
  ) {
    return this.carsService.updateAvailability(id, body.isAvailable);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
