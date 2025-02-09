import { Module } from '@nestjs/common';

import { RedisPropagatorService } from './redis-propagator.service';
import { RedisModule } from 'src/app/shared/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RedisPropagatorService],
  exports: [RedisPropagatorService],
})
export class RedisPropagatorModule {}
