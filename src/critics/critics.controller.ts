import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
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

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCriticDto: UpdateCriticDto,
  ) {
    return this.criticsService.update(id, updateCriticDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.criticsService.remove(id);
  }
}
