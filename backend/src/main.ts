import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { AdminUserSeeder } from './database/seeders/admin-user.seeder';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilitar validación automática de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Añadir prefijo global para que las rutas coincidan con el frontend (/api/...)
  app.setGlobalPrefix('api');

  // Habilitar CORS para el frontend (Vite dev server por defecto en 5173)
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // Ejecutar seeder para crear usuario admin de prueba
  const seeder = app.get(AdminUserSeeder);
  await seeder.seed();

  // Servir archivos estáticos (imágenes de autos)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // Log simple para facilitar debugging al iniciar

  console.log(`Server listening on http://localhost:${port}/api`);
}
bootstrap();
