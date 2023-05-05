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
import { Genre, Movie } from './entities';
import { isUUID } from 'class-validator';
import { UsersService } from 'src/users/users.service';
import { CriticsService } from 'src/critics/critics.service';
import { CreateCriticDto } from 'src/critics/dto/create-critic.dto';
import { UpdateCriticDto } from 'src/critics/dto/update-critic.dto';
import { Genero, Genres } from './interfaces/genre.interface';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class MoviesService {
  private readonly axios: AxiosInstance = axios;
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly userService: UsersService,
    private readonly criticService: CriticsService,
  ) {}

  async createGenre(genre: Genero) {
    try {
      const genreDB = this.genreRepository.create(genre);
      await this.genreRepository.save(genreDB);
      return;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async create(createMovieDto: CreateMovieDto) {
    const randomUser = await this.userService.getRandomUser();
    console.log({ randomUser });

    try {
      const movie = this.movieRepository.create({
        ...createMovieDto,
        user: randomUser,
        genres: [],
      });
      await this.movieRepository.save(movie);
      return movie;
    } catch (error) {
      console.log({ error });
      this.errorHandler(error);
    }
  }

  async loadAPIInfo() {
    const {
      data: { genres },
    } = await axios.get<Genres>(
      `${process.env.BASE_URL}/genre/movie/list?api_key=${process.env.API_KEY}`,
    );

    await this.genreRepository.delete({});
    genres.forEach(async (genre) => {
      await this.createGenre({
        id: genre.id,
        name: genre.name.toLowerCase(),
      });
    });
    return 'sí';
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
        genres: [],
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
        genres: [],
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
