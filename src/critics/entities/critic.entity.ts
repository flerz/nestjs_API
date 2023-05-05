import { ApiProperty } from '@nestjs/swagger';
import { Movie } from 'src/movies/entities';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Critic {
  @ApiProperty({
    type: String,
    description: 'Critic ID is an UUID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    type: String,
  })
  @Column('text', {
    nullable: false,
  })
  description: string;

  @DeleteDateColumn({
    select: false,
  })
  deleteAt?: string;

  @OneToOne(() => Movie)
  movie: Movie;
}
