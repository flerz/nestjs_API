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
  }

  async findOne(id: string) {
    try {
      const critic = await this.criticRepository.findOneBy({ id });
      return critic;
    } catch (error) {
      throw new InternalServerErrorException(`Can not get critic ${id}`);
    }
    return `This action returns a #${id} critic`;
  }

  update(id: string, updateCriticDto: UpdateCriticDto) {
    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} critic`;
  }
}
