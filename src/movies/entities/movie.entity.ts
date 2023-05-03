import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column('numeric')
  ranking: number;
  @Column('text')
  language: string;
  @Column('text')
  genre: string[];
  @Column('text')
  critic: string;
}
