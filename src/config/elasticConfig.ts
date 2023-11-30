import { Client } from '@elastic/elasticsearch';

class ElasticConfig {
  private static _instance: ElasticConfig;
  private client: Client;

  private constructor() {
    this.client = new Client({ node: 'http://localhost:9200' });
  }

  public static getInstance(): ElasticConfig {
    if (!this._instance) {
      this._instance = new ElasticConfig();
    }

    return this._instance;
  }

  public getClient(): Client {
    return this.client;
  }

  public async createBaseIndex(indexName: string): Promise<void> {
    try {
      await this.client.indices.create({
        index: indexName,
        body: {
          mappings: {
            properties: {            
              field1: { type: 'text' },
              field2: { type: 'keyword' },
            },
          },
        },
      });
      console.log(`Index '${indexName}' created successfully.`);
    } catch (error) {
      console.error(`Error creating index '${indexName}':`, error);
      throw error;
    }
  }
}

export default ElasticConfig;