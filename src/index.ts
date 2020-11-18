import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cbr from './cbr';
import { Currency } from './entities/Currency';
import { CurrencyResolver } from './resolvers/currency';
import { ErrorResolver } from './resolvers/error';

const main = async () => {
  const app = express();

  await createConnection({
    type: 'postgres',
    database: 'banoka',
    username: 'postgres',
    password: 'myPassword',
    entities: [Currency],
    synchronize: true,
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CurrencyResolver, ErrorResolver],
      validate: false,
    }),
  });
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log('server started on localhost:4000');
  });
  cbr();
};

main().catch(err => console.error(err));
