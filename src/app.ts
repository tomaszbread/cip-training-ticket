import express from 'express';
import LocationAlertRoutes from './routes/locationAlertRoutes';
import ElasticConfig from './config/elasticConfig';
import RedisStreamSubscriber from './subscribers/redisStreamSubscriber';
import RedisConfig from './config/redisConfig';
import LocationAlertController from './controllers/locationAlertController';
import LocationAlertService from './services/locationAlertService';

class App {
  private readonly app: express.Application;
  private readonly port: number;
  private readonly redisStreamSubscriber = new RedisStreamSubscriber();
  private locationAlertService: LocationAlertService;
  private redisConfig: RedisConfig;
  private elasticConfig: ElasticConfig;
  private locationAlertController: LocationAlertController;

  private streamKey = 'location-alert-stream';
  private indexName = 'location-alert';

  constructor() {
    this.app = express();
    this.port = 3000;
    this.redisConfig = new RedisConfig();
    this.locationAlertController = new LocationAlertController();
    this.locationAlertService = new LocationAlertService();
    this.elasticConfig = new ElasticConfig();
    this.redisConfig.initConfig();
    this.configureServer();
    this.configureRoutes();
    this.startServer();
    this.initializeElasticsearch();
    this.locationAlertController.createLocationAlert();
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
    try {
      await this.elasticConfig.createBaseIndex(this.indexName);
    } catch (error) {
      console.error('Error in main application:', error);
    }
  }

  private locationAlertStreamSubscriber() {
    this.redisStreamSubscriber.subscribeToStream(this.streamKey, (locationAlert: any) => {
      console.log('received message', locationAlert);
      this.locationAlertService.saveLocationAlertToElasticSearch(locationAlert);
    });
  }

}


const application = new App();
