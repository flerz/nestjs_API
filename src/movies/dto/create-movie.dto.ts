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

export class CreateMovieDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  image: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @MinLength(1)
  language: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  genres?: string[];

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  ranking?: number;

  @IsDate()
  @IsOptional()
  delete_date?: string;
}
