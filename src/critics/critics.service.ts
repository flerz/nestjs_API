import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException(`Can not get critic ${id}`);
    }
  }

  async update(id: string, updateCriticDto: UpdateCriticDto) {
    try {
      const critic = await this.criticRepository.preload({
        id,
        ...updateCriticDto,
      });
      if (!critic) throw new NotFoundException(`Critc ${id} not found`);
      await this.criticRepository.save(critic);
      return critic;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async remove(id: string) {
    const critic = await this.findOne(id);
    try {
      if (!critic.deleteAt) {
        const queryBuilder = this.criticRepository.createQueryBuilder();
        const criticDeleted = await queryBuilder
          .softDelete()
          .where('id = :id', { id: id })
          .execute();

        return criticDeleted;
      }
    } catch (error) {
      this.errorHandler(error, id, critic);
    }
  }

  private errorHandler(error, id?, critic?) {
    if (error.code === '23505')
      throw new BadRequestException(`${error.detail}`);

    if (!!id && !critic)
      throw new BadRequestException(`Record ${id} does not exits`);

    throw new InternalServerErrorException(`${error}`);
  }
}
