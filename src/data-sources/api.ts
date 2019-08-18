import { RESTDataSource } from 'apollo-datasource-rest';

class ApiDataSource extends RESTDataSource {
  baseURL = '';

  public async getUserFavorites() {
    const data = await this.get('/');
    return data;
  }
}

export default ApiDataSource;
