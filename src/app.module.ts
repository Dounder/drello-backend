import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { ENV_CONFIG } from './config/app.config';
import { JoiValidationSchema } from './config/joi.config';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ListsModule } from './lists/lists.module';
import { RequestsModule } from './requests/requests.module';
import { SubRequestsModule } from './sub-requests/sub-requests.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
      validationSchema: JoiValidationSchema,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ssl:
          process.env.STATE === 'prod'
            ? { rejectUnauthorized: false, sslmode: 'require' }
            : (false as any),
        host: configService.get('dbHost'),
        port: configService.get('dbPort'),
        username: configService.get('dbUsername'),
        password: configService.get('dbPassword'),
        database: configService.get('dbName'),
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),

    AuthModule,

    UsersModule,

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault],
        path: 'api/v1/graphql',
        context: ({ req }) => {
          const token = req.headers.authorization?.replace(/[Bb]earer\s?/g, '');
          if (!token) throw Error('Token needed');
          const payload = jwtService.decode(token);
          if (!payload) throw Error('Token not valid');
        },
      }),
    }),

    SeedModule,

    ClientsModule,

    ProjectsModule,

    ListsModule,

    RequestsModule,

    SubRequestsModule,

    TasksModule,
  ],
})
export class AppModule {}
