import { PartialType } from '@nestjs/mapped-types';
import { CreateCriticDto } from './create-critic.dto';

export class UpdateCriticDto extends PartialType(CreateCriticDto) {}
