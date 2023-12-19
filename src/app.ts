import express from 'express';
import LocationAlertRoutes from './routes/locationAlertRoutes';
import ElasticConfig from './config/elasticConfig';
import RedisStreamSubscriber from './client/redisStreamSubscriber';
import RedisConfig from './config/redisConfig';

class App {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly redisStreamSubscriber = new RedisStreamSubscriber();
  private redisConfig: RedisConfig;
  private streamKey = 'location-alert-stream';
  constructor() {
    this.app = express();
    this.port = 3000;
    this.redisConfig = new RedisConfig();

    this.redisConfig.initConfig();
    this.configureServer();
    this.configureRoutes();
    this.startServer();
    this.initializeElasticsearch();
    this.locationAlertStreamSubscriber();
  }

  private configureServer(): void {
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use('/location-alerts', LocationAlertRoutes);
  }

  private startServer(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }

  private async initializeElasticsearch(): Promise<void> {
    const elasticConfig = ElasticConfig.getInstance();
    try {
      await elasticConfig.createBaseIndex('location-alert');
    } catch (error) {
      console.error('Error in main application:', error);
    }
  }

  private locationAlertStreamSubscriber() {
    this.redisStreamSubscriber.subscribeToStream(this.streamKey, (locationAlert) => {
      // Do something with the received message
      console.log(locationAlert);
    });
  }

}

const application = new App();
