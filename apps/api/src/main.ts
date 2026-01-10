import { NestFactory } from '@nestjs/core';
import { DomainErrorFilter } from './shared';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
  app.useGlobalFilters(new DomainErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
