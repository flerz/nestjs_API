import {
  IsArray,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Genre } from '../entities';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 'It',
    description: 'Movie original title',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: '/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
    description: 'Movie poster',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  image: string;

  @ApiProperty({
    example:
      'Amet fugiat qui ad in. Commodo labore veniam officia incididunt consectetur voluptate laborum aliquip dolore in dolore amet consectetur anim. Esse mollit nostrud officia id.',
    description: 'Movie description',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    example: 'en',
    description: 'Movie language',
    enum: ['en', 'es', 'nl'],
  })
  @IsString()
  @MinLength(1)
  language: string;

  @ApiProperty({
    type: [Genre],
    oneOf: [{ $ref: getSchemaPath(Genre) }],
  })
  @IsArray()
  @IsOptional()
  genres?: Genre[];

  @ApiProperty({
    example: 3.1,
    description: 'Movie ranking',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  ranking?: number;
}

export class PreCreateMovieDto {
  @ApiProperty({
    example: 'It',
    description: 'Movie original title',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    example: '/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg',
    description: 'Movie poster',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  image: string;

  @ApiProperty({
    example:
      'Amet fugiat qui ad in. Commodo labore veniam officia incididunt consectetur voluptate laborum aliquip dolore in dolore amet consectetur anim. Esse mollit nostrud officia id.',
    description: 'Movie description',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  description: string;

  @ApiProperty({
    example: 'en',
    description: 'Movie language',
    enum: ['en', 'es', 'nl'],
  })
  @IsString()
  @MinLength(1)
  language: string;

  @ApiProperty({
    type: [String],
  })
  @IsArray()
  @IsOptional()
  genres?: string[];

  @ApiProperty({
    example: 3.1,
    description: 'Movie ranking',
    default: 0,
  })
  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  ranking?: number;
}
