import { Injectable } from '@nestjs/common';
import { CreateCriticDto } from './dto/create-critic.dto';
import { UpdateCriticDto } from './dto/update-critic.dto';

@Injectable()
export class CriticsService {
  create(createCriticDto: CreateCriticDto) {
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
