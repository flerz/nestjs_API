import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'flerz',
    description: "User's username",
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    example: 'my@mail.com',
    description: "User's email",
  })
  @IsString()
  @MinLength(3)
  email: string;

  @ApiProperty({
    example: 'safetypassword',
    description: "User's password",
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: 'Luis Perez',
    description: "User's full name",
  })
  @IsString()
  @MinLength(3)
  fullName: string;
}
