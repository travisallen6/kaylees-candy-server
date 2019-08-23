import { set, connect, connection } from 'mongoose'

export default function connectToMongo(uri: string) {
  return new Promise((resolve, reject) => {
    set('useCreateIndex', true);
    connect(
      uri,
      { useNewUrlParser: true },
    );
    connection.once('open', () => {
      console.log(`Connected to mongoDb`);
      resolve();
    });
    connection.on('error', error => {
      reject(error);
    });
  })
}