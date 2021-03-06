import * as express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import schemas from './schemas';
import resolvers from './resolvers';
import {
  Inventory,
  User,
  Order,
  WaitlistProduct,
  TimeSlot,
  Confirmation,
} from './models';
import { config, logger } from './common';
import autoBind = require('auto-bind');
import { connect, set, connection } from 'mongoose';
import jwt from './utils/jwt-utils';
import * as cors from 'cors';

class Server {
  public app: express.Application = express();
  constructor() {
    autoBind(this);
    this.app.use(cors());
    const { isDev } = config;
    const typeDefs: DocumentNode = gql(schemas as any);
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
    const models = {
      Inventory,
      User,
      Order,
      WaitlistProduct,
      TimeSlot,
      Confirmation,
    };
    let user = null;
    if (token) {
      try {
        user = jwt.verify(token);
      } catch (error) {
        user = null;
      }
    }

    return { req, res, user, models };
  }

  private buildDataSources() {
    return {};
  }

  private listen() {
    this.app.listen(config.port, config.hostName, () =>
      logger.info(`⚓️ Hard to port ${config.port}`),
    );
  }

  public async initialize() {
    try {
      await this.connectToMongodb();
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
