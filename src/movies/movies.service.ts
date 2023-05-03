import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities';
import { isUUID } from 'class-validator';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}
  async create(createMovieDto: CreateMovieDto) {
    try {
      const movie = this.movieRepository.create(createMovieDto);
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException('Ayudita!!');
    }
  }

  async findAll() {
    try {
      const movies = await this.movieRepository.find({});
      return movies;
    } catch (error) {
      throw new InternalServerErrorException('Can not get records.');
    }
  }

  async findOne(id: string) {
    let movie: Movie;
    if (isUUID(id)) movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      const queryBuilder = this.movieRepository.createQueryBuilder();
      movie = await queryBuilder
        .where('LOWER(title) = :title', {
          title: id.toLowerCase(),
        })
        .getOne();
    }
    if (!movie) throw new NotFoundException(`Can not find movie ${id}`);
    return movie;
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    try {
      const movie = await this.movieRepository.preload({
        id,
        ...updateMovieDto,
      });
      if (!movie) throw new NotFoundException(`Movie ${id} not found`);
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async remove(id: string) {
    const movie = await this.findOne(id);
    try {
      if (!movie.deleteAt) {
        const queryBuilder = this.movieRepository.createQueryBuilder();
        const movieDeleted = await queryBuilder
          .softDelete()
          .where('id = :id', { id: id })
          .execute();

        return movieDeleted;
      }
    } catch (error) {
      this.errorHandler(error, id, movie);
    }
  }

  private errorHandler(error, id?, movie?) {
    if (error.code === '23505')
      throw new BadRequestException(`${error.detail}`);

    if (!!id && !movie)
      throw new BadRequestException(`Record ${id} does not exits `);

    throw new InternalServerErrorException(`${error}`);
  }
}
