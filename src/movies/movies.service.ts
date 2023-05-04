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
import { UsersService } from 'src/users/users.service';
import { CriticsService } from 'src/critics/critics.service';
import { CreateCriticDto } from 'src/critics/dto/create-critic.dto';
import { UpdateCriticDto } from 'src/critics/dto/update-critic.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly userService: UsersService,
    private readonly criticService: CriticsService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const randomUser = await this.userService.getRandomUser();
    console.log({ randomUser });

    try {
      const movie = this.movieRepository.create({
        ...createMovieDto,
        user: randomUser,
      });
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      console.log({ error });
      this.errorHandler(error);
    }
  }

  async findAll() {
    try {
      const movies = await this.movieRepository.find({});

      return movies;
    } catch (error) {
      console.error(error);

      this.errorHandler(error);
    }
  }

  async findOne(id: string) {
    let movie: Movie;
    if (isUUID(id)) movie = await this.movieRepository.findOneBy({ id });

    if (!movie) {
      const queryBuilder = this.movieRepository.createQueryBuilder('mov');
      movie = await queryBuilder
        .where('LOWER(title) = :title', {
          title: id.toLowerCase(),
        })
        .leftJoinAndSelect('mov.critic', 'critic')
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

  async rate(id: string, updateMovieDto: UpdateMovieDto) {
    const { ranking } = updateMovieDto;

    try {
      const movie = await this.movieRepository.preload({
        id,
        ...updateMovieDto,
      });

      if (!movie.rank_votes[0]) movie.rank_votes.shift();

      movie.rank_votes.push(ranking);
      movie.ranking =
        movie.rank_votes.reduce((a, b) => a + b, 0) / movie.rank_votes.length;

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

  async createCritic(id: string, createCritic: CreateCriticDto) {
    try {
      const movie = await this.movieRepository.preload({
        id,
        critic: await this.criticService.create(createCritic),
      });
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async updateCritic(
    id: string,
    cid: string,
    updateCriticDto: UpdateCriticDto,
  ) {
    try {
      const movie = await this.movieRepository.preload({
        id,
        critic: await this.criticService.update(cid, updateCriticDto),
      });
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async removeCritic(id: string, cid: string) {
    try {
      await this.criticService.remove(cid);
      return;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  private errorHandler(error, id?, movie?) {
    if (error.code === '23505')
      throw new BadRequestException(`${error.detail}`);

    if (error.code === '23502')
      throw new BadRequestException(`${error.detail}`);

    if (!!id && !movie)
      throw new BadRequestException(`Record ${id} does not exits `);

    throw new InternalServerErrorException(`${error}`);
  }
}
