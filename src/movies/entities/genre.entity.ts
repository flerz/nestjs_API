import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Genre {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;
}
