import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import axios, { AxiosInstance } from 'axios';

import { UsersService } from 'src/users/users.service';
import { CriticsService } from 'src/critics/critics.service';
import { CreateCriticDto } from 'src/critics/dto/create-critic.dto';
import { UpdateCriticDto } from 'src/critics/dto/update-critic.dto';
import { Genre, Movie } from './entities';
import { Genero, Genres } from './interfaces/genre.interface';
import { CreateMovieDto, PreCreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movies } from './interfaces/movie.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  private readonly axios: AxiosInstance = axios;

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  handleCron() {
    this.loadAPIInfo();
    this.logger.debug('Movies and Genres Update.');
  }

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

  async preCreate(preCreateMovieDto: PreCreateMovieDto) {
    const { genres, ...movieDetails } = preCreateMovieDto;
    const genresDB: Genre[] = [];
    genres.forEach(async (genre) => {
      const genreQ = await this.genreRepository.findOne({
        where: { name: genre },
      });
      genresDB.push(genreQ);
    });
    return this.create({ ...movieDetails, genres: genresDB });
  }

  async create(createMovieDto: CreateMovieDto) {
    const randomUser = await this.userService.getRandomUser();

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

  async loadAPIInfo() {
    await this.loadGenres();

    await this.loadMovies();

    return 'sí';
  }

  async loadGenres() {
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
    return;
  }

  async loadMovies() {
    const {
      data: { results },
    } = await axios.get<Movies>(
      `${process.env.BASE_URL}/movie/popular?api_key=${process.env.API_KEY}`,
    );
    await this.movieRepository.delete({});
    results.forEach(async (movie) => {
      const genres: Genre[] = [];
      movie.genre_ids.forEach(async (genre) => {
        const genreDB = await this.findGenre(genre.toString());
        genres.push(genreDB);
      });

      await this.create({
        title: movie.original_title,
        image: movie.poster_path,
        description: movie.overview,
        language: movie.original_language,
        genres,
      });
    });
    return;
  }

  async findGenre(id: string) {
    let genre = await this.genreRepository.findOneBy({ id: +id });
    if (!genre)
      genre = await this.genreRepository.findOne({ where: { name: id } });
    return genre;
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
