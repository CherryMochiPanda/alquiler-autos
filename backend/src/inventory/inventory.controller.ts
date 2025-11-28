import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() createInventoryDto: CreateInventoryDto) {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get('location/:locationId')
  findByLocation(@Param('locationId') locationId: string) {
    return this.inventoryService.findByLocation(locationId);
  }

  @Get('car/:carId')
  findByCar(@Param('carId') carId: string) {
    return this.inventoryService.findByCar(carId);
  }

  @Get(':carId/:locationId')
  findOne(
    @Param('carId') carId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.inventoryService.findOne(carId, locationId);
  }

  @Patch(':carId/:locationId')
  update(
    @Param('carId') carId: string,
    @Param('locationId') locationId: string,
    @Body() updateInventoryDto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(carId, locationId, updateInventoryDto);
  }

  @Patch(':carId/:locationId/stock')
  updateStock(
    @Param('carId') carId: string,
    @Param('locationId') locationId: string,
    @Body() body: { stock: number },
  ) {
    return this.inventoryService.updateStock(carId, locationId, body.stock);
  }

  @Patch(':carId/:locationId/decrease')
  decreaseStock(
    @Param('carId') carId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.inventoryService.decreaseStock(carId, locationId);
  }

  @Patch(':carId/:locationId/increase')
  increaseStock(
    @Param('carId') carId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.inventoryService.increaseStock(carId, locationId);
  }

  @Delete(':carId/:locationId')
  remove(
    @Param('carId') carId: string,
    @Param('locationId') locationId: string,
  ) {
    return this.inventoryService.remove(carId, locationId);
  }
}
