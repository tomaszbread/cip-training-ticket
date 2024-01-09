import express from 'express';
import LocationAlertRoutes from './routes/locationAlertRoutes';
import ElasticConfig from './config/elasticConfig';
import RedisStreamSubscriber from './subscribers/redisStreamSubscriber';
import RedisConfig from './config/redisConfig';
import SocketConfig from './config/socketConfig';
import LocationAlertController from './controllers/locationAlertController';
import LocationAlertService from './services/locationAlertService';
import * as path from 'path';

class App {
  private readonly app: express.Application;
  private readonly port: number = 3000;

  private redisConfig: RedisConfig;
  private socketConfig: SocketConfig
  private elasticConfig: ElasticConfig;

  private redisStreamSubscriber: RedisStreamSubscriber;
  private locationAlertService: LocationAlertService;
  private locationAlertController: LocationAlertController;

  private streamKey = 'location-alert-stream';
  private indexName = 'location-alert';



  constructor() {
    this.app = express();
    this.socketConfig = new SocketConfig(this.app)
    this.redisConfig = new RedisConfig();
    this.redisStreamSubscriber = new RedisStreamSubscriber();
    this.locationAlertController = new LocationAlertController();
    this.locationAlertService = new LocationAlertService();
    this.elasticConfig = new ElasticConfig();
    this.onInit();
  }

  private async onInit() {
    this.configureRedis();
    this.configureServer();
    this.configureStaticFiles();
    this.configureRoutes();
    this.startServer();
    await this.initializeElasticSearch();
    this.createLocationAlert();
    await this.locationAlertStreamSubscriber();
  }

  private configureServer(): void {
    this.app.use(express.json());


  }
  private configureStaticFiles(): void {

    this.app.get('/', (req, res) => {
      const indexPath = path.join(__dirname, '/public/index.html');
      res.sendFile(indexPath);
    });
  }
  
  private configureRedis(){
    this.redisConfig.initConfig();
  }

  private configureRoutes(): void {
    this.app.use('/location-alerts', LocationAlertRoutes);
  }

  private startServer(): void {
    this.socketConfig.startServer(this.port);

  }

  private async initializeElasticSearch(): Promise<void> {
    try {
      await this.elasticConfig.createBaseIndex(this.indexName);
    } catch (error) {
      console.error('Error in main application:', error);
    }
  }

  private createLocationAlert(){
    this.locationAlertController.createLocationAlert();
  }

  private async locationAlertStreamSubscriber() {
    this.redisStreamSubscriber.subscribeToStream(this.streamKey, async (locationAlert: any) => {
      console.log('received message', locationAlert);
      this.locationAlertService.saveLocationAlertToElasticSearch(locationAlert);
      const updatedData = await this.locationAlertService.fetchLocationAlertData();
      this.socketConfig.io.emit('elasticsearch-data', updatedData);
    });
  }

}


const application = new App();
