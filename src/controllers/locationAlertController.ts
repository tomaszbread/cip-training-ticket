import { Request, Response } from 'express';
import LocationAlert from '../models/locationAlert';
import LocationAlertService from '../services/locationAlertService';
import RedisConfig from '../config/redisConfig';

class LocationAlertController {

  private locationAlertService: LocationAlertService;
  private redisConfig: RedisConfig;

  constructor() {
    this.getLocationAlert = this.getLocationAlert.bind(this);
    this.locationAlertService = new LocationAlertService();
    this.redisConfig = new RedisConfig();
  }

  public getLocationAlert(req: Request, res: Response) {
    this.createLocationAlert();
    res.json("STARTING ALERT PROCESS");
  }

  public createLocationAlert(): void {
    const newAlert: LocationAlert = this.locationAlertService.generateRandomLocationAlert();
    this.publishToLocationAlertStream(newAlert);
  }

  public publishToLocationAlertStream(alert: LocationAlert): void {
    const streamAlert = Object.entries(alert) as any;
    this.redisConfig.client.xadd('location-alert-stream', '*', ...streamAlert);

  }


}

export default LocationAlertController;