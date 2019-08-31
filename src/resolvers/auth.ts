import { config } from '../common';
import { UserInputError, ForbiddenError } from 'apollo-server-express';
import { IContext } from '../types';
import { jwt } from '../utils';
import { v4 as randomId } from 'uuid';
import autoBind = require('auto-bind');
import * as bcrypt from 'bcryptjs';

class Resolvers {
  constructor() {
    autoBind(this);
  }

  private generateJwt(id: string, isAdmin: boolean) {
    const token = jwt.sign({ admin: isAdmin, id });
    return token;
  }

  public async checkCode(
    parent: {},
    args: { code: string },
    context: IContext,
    info: any,
  ) {
    return args.code === config.accessCode;
  }

  public async login(
    parent: {},
    args: {
      userInfo: {
        code: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
      };
    },
    { models: { User } }: IContext,
    info: any,
  ) {
    const { code, firstName, lastName, email, phone } = args.userInfo;
    const { accessCode } = config;
    if (code.toLowerCase() !== accessCode) {
      throw new UserInputError('Incorrect code');
    }
    const user = await User.findOne({ email });
    if (!user) {
      const newUser = await User.create({ firstName, lastName, email, phone });
      return { token: this.generateJwt(newUser._id, false) };
    }
    return { token: this.generateJwt(user._id, false) };
  }

  public async authenticateAdmin(
    parent: any,
    args: { adminInfo: { email: string; password: string } },
    { models: { User } }: IContext,
  ) {
    const { email, password } = args.adminInfo;
    const adminUser = await User.findOne({ email, admin: true });
    if (!adminUser) throw new ForbiddenError('Forbidden');
    const authenticated = bcrypt.compareSync(password, adminUser.hash);
    if (!authenticated) throw new ForbiddenError('Forbidden');
    const token = this.generateJwt(adminUser._id, true);
    return { token: token };
  }
}

const resolvers = new Resolvers();

export default {
  Query: {
    checkCode: resolvers.checkCode,
  },
  Mutation: {
    login: resolvers.login,
    loginAdmin: resolvers.authenticateAdmin,
  },
};
