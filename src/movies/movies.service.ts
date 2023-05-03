import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities';

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

  findOne(id: string) {
    try {
      const movie = this.movieRepository.findOneBy({ id });
      return movie;
    } catch (error) {
      throw new InternalServerErrorException(`Can not find movie ${id}`);
    }
  }

  update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.findOne(id);
  }

  remove(id: string) {
    return `This action removes a #${id} movie`;
  }
}
