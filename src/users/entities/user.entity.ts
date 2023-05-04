import { Movie } from 'src/movies/entities';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  username: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    nullable: false,
  })
  password: string;

  @Column('text', {
    nullable: false,
  })
  fullName: string;

  @DeleteDateColumn({
    select: false,
  })
  deleteAt?: string;

  @OneToMany(() => Movie, (movie) => movie.user)
  movies: Movie[];
}
