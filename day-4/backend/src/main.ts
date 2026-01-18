import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Simple Storage')
    .setDescription('Arnold Darmawan - 241011450317')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);  
  SwaggerModule.setup('documentation', app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}/documentation`);
}

bootstrap().catch((error) => {
  console.error("Error boostrap:", error);
  process.exit(1); 
});
