import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Critic {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    nullable: false,
  })
  description: string;
}
