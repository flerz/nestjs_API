import { Module } from '@nestjs/common';
import { CriticsService } from './critics.service';
import { CriticsController } from './critics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Critic } from './entities/critic.entity';

@Module({
  controllers: [CriticsController],
  providers: [CriticsService],
  imports: [TypeOrmModule.forFeature([Critic])],
})
export class CriticsModule {}
