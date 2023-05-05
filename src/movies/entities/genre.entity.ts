import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Genre {
  @ApiProperty({
    type: Number,
  })
  @PrimaryColumn('numeric')
  id: number;

  @ApiProperty({
    type: String,
  })
  @Column()
  name: string;
}
