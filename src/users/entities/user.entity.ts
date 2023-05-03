import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    nullable: false,
  })
  username: string;
  @Column('text', {
    nullable: false,
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
}
