import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCriticDto } from './dto/create-critic.dto';
import { UpdateCriticDto } from './dto/update-critic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Critic } from './entities/critic.entity';

@Injectable()
export class CriticsService {
  constructor(
    @InjectRepository(Critic)
    private readonly criticRepository: Repository<Critic>,
  ) {}
  async create(createCriticDto: CreateCriticDto) {
    try {
      const critic = this.criticRepository.create(createCriticDto);
      await this.criticRepository.save(critic);
      return critic;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException('Help!!');
    }
    return 'This action adds a new critic';
  }

  findAll() {
    return `This action returns all critics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} critic`;
  }

  update(id: number, updateCriticDto: UpdateCriticDto) {
    return `This action updates a #${id} critic`;
  }

  remove(id: number) {
    return `This action removes a #${id} critic`;
  }
}
