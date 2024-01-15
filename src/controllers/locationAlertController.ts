import { Request, Response } from 'express';
import LocationAlert from '../models/locationAlert';
import LocationAlertService from '../services/locationAlertService';
import RedisConfig from '../config/redisConfig';

class LocationAlertController {

  private locationAlertService: LocationAlertService;
  private redisConfig: RedisConfig;
  private streamKey = "location-alert-stream";
  constructor(redisConfig: RedisConfig) {
    this.getLocationAlert = this.getLocationAlert.bind(this);
    this.locationAlertService = new LocationAlertService();
    this.redisConfig = redisConfig;
  }

  public getLocationAlert(req: Request, res: Response) {
    this.createLocationAlert();
    res.json();
  }

  public createLocationAlert(): void {
    const newAlert: LocationAlert = this.locationAlertService.generateRandomLocationAlert();
    this.publishToLocationAlertStream(newAlert);
  }

  public publishToLocationAlertStream(alert: LocationAlert): void {
    const streamAlert = Object.entries(alert) as any;
    this.redisConfig.client.publish(this.streamKey, JSON.stringify(alert));
    this.redisConfig.client.xadd(this.streamKey, '*', ...streamAlert);
  }


}

export default LocationAlertController;