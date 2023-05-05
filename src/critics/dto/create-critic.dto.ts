import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCriticDto {
  @ApiProperty({
    type: String,
    description:
      'Voluptate elit adipisicing aliqua commodo. Enim aliquip nulla aliquip dolore elit laborum do nulla in fugiat consequat amet aliquip ea. Duis ut qui exercitation deserunt proident elit tempor culpa eu sint reprehenderit officia. Culpa non sunt est sunt excepteur sunt ex mollit minim sint officia do id.',
  })
  @IsString()
  @MinLength(1)
  description: string;
}
