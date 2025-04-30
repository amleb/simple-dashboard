import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelloResolver } from './hello.resolver';
import { SqsModule } from './sqs/sqs.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // playground: false,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // typePaths: ['./**/*.graphql'],
      // definitions: {
      //   path: join(process.cwd(), 'src/graphql.ts'),
      //   outputAs: 'class',
      // },
    }),
    SqsModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloResolver],
})
export class AppModule {}
