import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...userDetails } = createUserDto;
    try {
      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;
    let user = await this.userRepository.findOne({ where: { username } });

    if (!user)
      user = await this.userRepository.findOne({ where: { email: username } });

    if (!user) throw new NotFoundException('Username/email not found');

    if (!bcrypt.compareSync(password, user.password))
      throw new BadRequestException('Wrong password');
    return user;
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({});
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Can not get records.');
    }
  }

  async findOne(id: string) {
    let user: User;
    try {
      if (isUUID(id)) user = await this.userRepository.findOneBy({ id });

      if (!user) {
        const queryBuilder = this.userRepository.createQueryBuilder();
        user = await queryBuilder
          .where('LOWER(username) =:username', {
            username: id.toLowerCase(),
          })
          .getOne();
      }

      return user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.preload({
        id,
        ...updateUserDto,
      });
      if (!user) throw new NotFoundException(`User ${id} not found`);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async getRandomUser() {
    const randUser = this.userRepository.createQueryBuilder('user');
    try {
      const user = await randUser.select().orderBy('RANDOM()').getOne();
      return user;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    try {
      if (!user.deleteAt) {
        const queryBuilder = this.userRepository.createQueryBuilder();
        const userDeleted = await queryBuilder
          .softDelete()
          .where('id = :id', { id: id })
          .execute();

        return userDeleted;
      }
    } catch (error) {
      this.errorHandler(error, id, user);
    }
  }

  private errorHandler(error, id?, user?) {
    console.log({ error });

    if (error.code === '23505')
      throw new BadRequestException(`${error.detail}`);

    if (!!id && !user)
      throw new BadRequestException(`Record ${id} does not exits `);

    throw new InternalServerErrorException(`${error}`);
  }
}
