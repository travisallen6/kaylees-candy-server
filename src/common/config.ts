require('dotenv').config();

const {
  NODE_ENV,
  HOSTNAME,
  PORT,
  MONGODB_URI,
  LOG_LEVEL
} = process.env

class Config {

  public readonly isDev = NODE_ENV !== 'production';
  public readonly hostName = HOSTNAME;
  public readonly port = this.normalizePort(PORT);
  public readonly mongodbUri = MONGODB_URI;
  public readonly logLevel = LOG_LEVEL

  normalizePort(port: string) {
    const normalizedPort = +port;
    if (!normalizedPort) {
      throw new Error(`Incorrect value for PORT: ${normalizedPort}`)
    }
    return normalizedPort;
  }

  ensureRequiredEnvVariables = () => {
    const missingVariables = [
      'NODE_ENV',
      'HOSTNAME',
      'PORT',
      'MONGODB_URI',
      'LOG_LEVEL'
    ].filter(variable => !process.env[variable]);
    if (missingVariables.length) {
      throw new Error(`ENV variables: ${missingVariables.join(', ')} are undefined`)
    }
  }
}

export default new Config();