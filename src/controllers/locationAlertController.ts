import { Request, Response } from 'express';
import LocationAlert from '../models/locationAlert';
import LocationAlertService from '../services/locationAlertService';
import RedisConfig from '../config/redisConfig';

class LocationAlertController {

  private locationAlertService: LocationAlertService;
  private redisConfig: RedisConfig;

  constructor() {
    this.locationAlertService = new LocationAlertService();
    this.redisConfig = new RedisConfig();
  }

  public getLocationAlerts(req: Request, res: Response): void {
    const alerts: LocationAlert[] = [
      {
        id: '1',
        userId: 'admin',
        latitude: 40.7128,
        longitude: -74.0060,
        message: 'local admin',
        timestamp: new Date().getTime()
      } as LocationAlert,
    ];
    res.json(alerts);
  }

  public createLocationAlert(): void {
    const newAlert: LocationAlert = this.locationAlertService.generateRandomLocationAlert();
    this.publishToLocationAlertStream(newAlert);
  }

  public publishToLocationAlertStream(alert: LocationAlert): void {
    const streamAlert = Object.entries(alert) as any;
    console.log("stream alert", streamAlert);
    this.redisConfig.client.xadd('location-alert-stream', '*', ...streamAlert);
  }


}

export default LocationAlertController;