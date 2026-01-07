import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdentityModule } from './contexts/identity/identity.module';

@Module({
  imports: [
    // NOTA: Necessari pq els arxius d'environment siguin accessibles des de l'api (ex: "process.env.dev")
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IdentityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
