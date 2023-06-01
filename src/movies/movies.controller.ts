import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { MoviesService } from './movies.service';
import { PreCreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateCriticDto } from 'src/critics/dto/create-critic.dto';
import { UpdateCriticDto } from 'src/critics/dto/update-critic.dto';
import { Movie } from './entities';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/entities/user.entity';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@ApiTags('Movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Película agregada', type: Movie })
  @ApiResponse({ status: 400, description: 'Formulario erróneo' })
  create(@Body() createMovieDto: PreCreateMovieDto) {
    return this.moviesService.preCreate(createMovieDto);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Lista de películas', type: Movie })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':term')
  @ApiResponse({ status: 200, description: 'Película consultada', type: Movie })
  @ApiResponse({ status: 404, description: 'Película no existe' })
  findOne(@Param('term') term: string) {
    return this.moviesService.findOne(term);
  }

  @Post(':id/critics')
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 201, description: 'Crítica agregada', type: Movie })
  @ApiResponse({ status: 400, description: 'Película no existe' })
  @ApiResponse({ status: 400, description: 'Formulario erróneo' })
  postCritic(
    @GetUser() user: User,
    @Body() createCritic: CreateCriticDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.moviesService.createCritic(id, createCritic, user.id);
  }

  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Película editada', type: Movie })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Patch(':id/critics/:cid')
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 200, description: 'Crítica editada', type: Movie })
  @ApiResponse({ status: 400, description: 'Película no existe' })
  @ApiResponse({ status: 400, description: 'Crítica no existe' })
  patchCritic(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('cid', ParseUUIDPipe) cid: string,
    @Body() updateCriticDto: UpdateCriticDto,
  ) {
    return this.moviesService.updateCritic(id, cid, updateCriticDto, user.id);
  }

  @Patch('rate/:id')
  @ApiResponse({
    status: 200,
    description: 'Calificación de película editada',
    type: Movie,
  })
  @ApiResponse({ status: 400, description: 'Película no existe' })
  rate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.rate(id, updateMovieDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Película eliminada' })
  @ApiResponse({ status: 404, description: 'Película no existe' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.remove(id);
  }

  @Delete(':id/critics/:cid')
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 200, description: 'Crítica eliminada' })
  @ApiResponse({ status: 404, description: 'Película no existe' })
  @ApiResponse({ status: 404, description: 'Crítica no existe' })
  removeCritic(
    @GetUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('cid', ParseUUIDPipe) cid: string,
  ) {
    return this.moviesService.removeCritic(id, cid, user.id);
  }

  // Descomentar si se quiere cargar la DB con información de la API
  // @Get('//seed')
  // seed() {
  //   return this.moviesService.loadAPIInfo();
  // }
}
