import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import schemas from './schemas';
import resolvers from './resolvers';
import { Inventory } from './data-sources';
import { config, logger } from './common';
import autoBind = require('auto-bind');
import { connect, set, connection } from 'mongoose';
import jwt from './utils/jwt-utils'

class Server {
  public app: express.Application = express();
  constructor() {
    autoBind(this);
    const { isDev } = config
    const typeDefs: DocumentNode = gql(schemas);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: this.buildContext,
      dataSources: this.buildDataSources,
      introspection: isDev,
      playground: isDev,
    });

    server.applyMiddleware({
      app: this.app,
      cors: isDev,
    });
  }

  private buildContext({
    req,
    res,
  }: {
    req: express.Request;
    res: express.Response;
  }) {
    const token = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : '';
    let user = null;
    if (token) {
      try {
        user = {}
      } catch (error) {
        user = null;
      }
    }

    return { req, res, user };
  }

  private buildDataSources() {
    return {
      inventory: new Inventory()
    };
  }

  private listen() {
    this.app.listen({ port: config.port }, () =>
      logger.info(`⚓️ Hard to port ${config.port}`),
    );
  }

  public async initialize() {
    try {
      await this.connectToMongodb()
      this.listen();
    } catch (error) {
      throw error;
    }
  }

  private async connectToMongodb() {
    return new Promise((resolve, reject) => {
      set('useCreateIndex', true);
      connect(
        config.mongodbUri,
        { useNewUrlParser: true },
      );
      connection.once('open', () => {
        logger.info(`Connected to mongoDb`);
        resolve();
      });
      connection.on('error', error => {
        reject(error);
      });
    });
  }
}

export default new Server();
