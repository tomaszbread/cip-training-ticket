import { Request, Response } from 'express';
import LocationAlert from '../models/locationAlert';
import LocationAlertService from '../services/locationAlertService';
import RedisConfig from '../config/redisConfig';

class LocationAlertController {
    private locationAlertService: LocationAlertService
    private redisConfig: RedisConfig

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
        longitude: -74.0060 ,
        message: 'local admin',
        timestamp: new Date(),
      } as LocationAlert,
    ];
    res.json(alerts);
  }

  public createLocationAlert(): void {
    const newAlert: LocationAlert = this.locationAlertService.generateRandomLocationAlert();
    console.log("createLocationAlert", newAlert)
    this.publishToLocationAlertStream(newAlert);
  }

  public publishToLocationAlertStream(alert: LocationAlert): void {
    const streamAlert = JSON.stringify(alert);
    console.log("publishToLocationAlertStream", streamAlert)
   /// this.redisConfig.client.xadd('location-alert-stream', '*', alert.timestamp.toString(), streamAlert);

    // Use XADD to add the JSON string to the stream
    this.redisConfig.client.xadd('location-alert-stream', '*', 'data', streamAlert, (err, result) => {
  if (err) {
    console.error('Error adding message to stream:', err);
  } else {
    console.log('Message added to stream with ID:', result);
  }

  // Close the Redis connection
  this.redisConfig.client.quit();
});



  }
}

export default LocationAlertController;