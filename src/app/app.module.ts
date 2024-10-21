import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule],
  providers: [EventsGateway],
})
export class AppModule {}
