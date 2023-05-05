import { Module } from '@nestjs/common';
import { CriticsService } from './critics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Critic } from './entities/critic.entity';

@Module({
  controllers: [],
  providers: [CriticsService],
  imports: [TypeOrmModule.forFeature([Critic])],
  exports: [CriticsService],
})
export class CriticsModule {}
