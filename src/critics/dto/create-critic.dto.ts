import { IsString, MinLength } from 'class-validator';

export class CreateCriticDto {
  @IsString()
  @MinLength(1)
  description: string;
}
