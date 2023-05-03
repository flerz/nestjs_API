import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException('Fail');
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({});
      return users;
    } catch (error) {
      throw new InternalServerErrorException('Can not get records.');
    }
  }

  findOne(id: string) {
    try {
      const user = this.userRepository.findOneBy({ id });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(`Can not get ${id}`);
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
