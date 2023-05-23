import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({ status: 201, description: 'Usuario agregado', type: User })
  @ApiResponse({ status: 400, description: 'Formulario Incompleto' })
  @ApiResponse({ status: 400, description: 'Usuario ya existe' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: User })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiResponse({ status: 200, description: 'Usuario consultado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no existe' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiResponse({ status: 200, description: 'Usuario editado', type: User })
  @ApiResponse({ status: 400, description: 'Usuario ya existe' })
  @ApiResponse({ status: 404, description: 'Usuario no existe' })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no existe' })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
