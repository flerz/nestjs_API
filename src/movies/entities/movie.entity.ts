import { Critic } from 'src/critics/entities/critic.entity';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Genre } from './genre.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @Column('text')
  image: string;

  @Column('text')
  description: string;

  @Column('numeric', { default: 0 })
  ranking?: number;

  @Column('text')
  language: string;

  @Column({
    type: 'numeric',
    insert: true,
    array: true,
  })
  rank_votes: number[];

  @DeleteDateColumn({
    select: false,
  })
  deleteAt?: string;

  @OneToOne(() => Critic, (critic) => critic.movie, { eager: true })
  @JoinColumn()
  critic: Critic;

  @ManyToOne(() => User, (user) => user.movies)
  user: User;

  @ManyToMany(() => Genre, { eager: true })
  @JoinTable()
  genres: Genre[];

  @BeforeInsert()
  rankVotes() {
    this.rank_votes = [this.ranking];
  }
}
