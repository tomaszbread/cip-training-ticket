
import { Request, Response } from 'express';
import LocationAlert from '../models/locationAlert';
import LocationAlertService from '../services/locationAlertService';
const locationAlertService = new LocationAlertService();

const getLocationAlerts = (req: Request, res: Response) => {
    const alerts: LocationAlert[] = [
        {
            id: "1",
            userId: "admin",
            location: { latitude: 40.7128, longitude: -74.0060 },
            message: "local admin",
            timestamp: new Date()
        } as LocationAlert
    ];
    res.json(alerts);
};

const createLocationAlert = (req: Request, res: Response) => {
    const newAlert: LocationAlert = locationAlertService.generateRandomLocationAlert();
    res.json(newAlert);
};

export { getLocationAlerts, createLocationAlert };