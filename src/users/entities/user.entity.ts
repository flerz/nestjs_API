import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'c4076136-ceaf-4719-a149-020535a31991',
    description: 'User ID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'flerz',
    description: "User's username",
  })
  @Column('text', {
    unique: true,
  })
  username: string;

  @ApiProperty({
    example: 'my@mail.com',
    description: "User's email",
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: 'safetypassword',
    description: "User's password",
  })
  @Column('text', {
    nullable: false,
  })
  password: string;

  @ApiProperty({
    example: 'Luis Perez',
    description: "User's full name",
  })
  @Column('text', {
    nullable: false,
  })
  fullName: string;

  @DeleteDateColumn({
    select: false,
  })
  deleteAt?: string;

  // @ApiProperty({
  //   oneOf: [{ $ref: getSchemaPath(Movie) }],
  // })
  @OneToMany(() => Movie, (movie) => movie.user)
  movies: Movie[];
}
