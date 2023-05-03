import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryColumn('numeric')
  id: number;
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
