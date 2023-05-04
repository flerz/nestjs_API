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
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
