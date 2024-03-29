import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { BoardMembersModule } from './board-members/board-members.module';
import { BoardsModule } from './boards/boards.module';
import { CardMembersModule } from './card-members/card-members.module';
import { CardsModule } from './cards/cards.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { ENV_CONFIG } from './config/app.config';
import { JoiValidationSchema } from './config/joi.config';
import { ListsModule } from './lists/lists.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { ChecklistItemsModule } from './checklist-items/checklist-items.module';

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
        ssl: process.env.STATE === 'prod' ? { rejectUnauthorized: false, sslmode: 'require' } : (false as any),
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
        formatError: (error: any) => {
          const { message, locations, path } = error;
          const formattedError = {
            message,
            locations,
            path,
            code: error.extensions?.exception?.response?.code || 'INTERNAL_SERVER_ERROR',
            response: error.extensions?.exception?.response,
            timestamp: new Date().toISOString(),
          };
          return formattedError;
        },
      }),
    }),

    SeedModule,

    BoardsModule,

    ListsModule,

    CardsModule,

    CardMembersModule,

    BoardMembersModule,

    ChecklistsModule,

    ChecklistItemsModule,
  ],
})
export class AppModule {}
