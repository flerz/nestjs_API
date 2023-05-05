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
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

@Entity()
export class Movie {
  @ApiProperty({
    example: 'c4076136-ceaf-4719-a149-020535a31991',
    description: 'Movie ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'It',
    description: 'Movie original title',
    minLength: 1,
  })
  @Column('text')
  title: string;

  @ApiProperty({
    example: '/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
    description: 'Movie poster',
    minLength: 1,
  })
  @Column('text')
  image: string;

  @ApiProperty({
    example:
      'Amet fugiat qui ad in. Commodo labore veniam officia incididunt consectetur voluptate laborum aliquip dolore in dolore amet consectetur anim. Esse mollit nostrud officia id.',
    description: 'Movie description',
    minLength: 1,
  })
  @Column('text')
  description: string;

  @ApiProperty({
    example: 3.1,
    description: 'Movie ranking',
    default: 0,
  })
  @Column('numeric', { default: 0 })
  ranking?: number;

  @ApiProperty({
    example: 'en',
    description: 'Movie language',
    enum: ['en', 'es', 'nl'],
  })
  @Column('text')
  language: string;

  @ApiProperty({
    type: [Number],
    example: [3, 5, 4, 1, 0],
    description: 'Movie amount of votes',
    default: [],
  })
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

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Critic) }],
  })
  @OneToOne(() => Critic, (critic) => critic.movie, { eager: true })
  @JoinColumn()
  critic: Critic;

  // @ApiProperty({
  //   oneOf: [{ $ref: getSchemaPath(User) }],
  // })
  @ManyToOne(() => User, (user) => user.movies)
  user: User;

  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(Genre) }],
  })
  @ManyToMany(() => Genre, { eager: true })
  @JoinTable()
  genres: Genre[];

  @BeforeInsert()
  rankVotes() {
    this.rank_votes = [this.ranking];
  }
}
