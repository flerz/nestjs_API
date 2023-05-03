import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CriticsService } from './critics.service';
import { CreateCriticDto } from './dto/create-critic.dto';
import { UpdateCriticDto } from './dto/update-critic.dto';

@Controller('critics')
export class CriticsController {
  constructor(private readonly criticsService: CriticsService) {}

  @Post()
  create(@Body() createCriticDto: CreateCriticDto) {
    return this.criticsService.create(createCriticDto);
  }

  @Get()
  findAll() {
    return this.criticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.criticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCriticDto: UpdateCriticDto) {
    return this.criticsService.update(+id, updateCriticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.criticsService.remove(+id);
  }
}
