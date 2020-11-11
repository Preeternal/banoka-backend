import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import cbr from './cbr';
import { Currency } from './entities/Currency';
import { CurrencyResolver } from './resolvers/currency';
import { HelloResolver } from './resolvers/hello';

const main = async () => {
  const app = express();

  const conn = await createConnection({
    type: 'postgres',
    database: 'banoka',
    username: 'postgres',
    password: 'myPassword',
    entities: [Currency],
    synchronize: true,
  });

  // const connectionManager = new ConnectionManager();

  // const connection = connectionManager.create({
  //   type: 'postgres',
  //   database: 'banoka',
  //   username: 'postgres',
  //   password: 'myPassword',
  //   entities: [Currency],
  //   synchronize: true,
  // });
  // await connection.connect();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, CurrencyResolver],
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
