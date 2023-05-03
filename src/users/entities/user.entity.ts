import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', {
    nullable: false,
    unique: true,
  })
  username: string;
  @Column('text', {
    nullable: false,
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
}
