import express from 'express';
import LocationAlertRoutes from './routes/locationAlertRoutes';
import ElasticConfig from './config/elasticConfig';
import RedisStreamSubscriber from './client/redisStreamSubscriber';

class App {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly redisStreamSubscriber = new RedisStreamSubscriber();
  private streamKey = 'location-alert-stream';
  constructor() {
    this.app = express();
    this.port = 3000;

    this.configureMiddleware();
    this.configureRoutes();
    this.startServer();
    this.initializeElasticsearch();
    this.locationAlertStreamSubscriber()
  }

  private configureMiddleware(): void {
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
      await elasticConfig.createBaseIndex('your_index_name');
    } catch (error) {
      console.error('Error in main application:', error);
    }
  }

  private locationAlertStreamSubscriber(){
    this.redisStreamSubscriber.subscribeToStream(this.streamKey, (locationAlert) => {
      // Do something with the received message
      console.log(locationAlert)
    });
  }

}

const application = new App();
