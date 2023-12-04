
import LocationAlert from '../models/locationAlert';

class LocationAlertService {

    generateUniqueId(): string {
        return Math.random().toString(36).substring(7);
    }

    generateRandomUserId(): string {
        return Math.random().toString(36).substring(7);
    }

    generateRandomLatitude(): number {
        return Math.random() * 180 - 90;
    }
    generateRandomLongitude(): number {
        return Math.random() * 360 - 180;
    }

    generateRandomLocation(): { latitude: number; longitude: number; } {
        return {
            latitude: Math.random() * 180 - 90,
            longitude: Math.random() * 360 - 180
        };
    }

    generateRandomMessage(): string {
        const messages = ['Alert 1', 'Alert 2', 'Alert 3'];
        return messages[Math.floor(Math.random() * messages.length)];
    }

    generateRandomLocationAlert(): LocationAlert {
        return {
            id: this.generateUniqueId(),
            userId: this.generateRandomUserId(),
            latitude: this.generateRandomLatitude(),
            longitude: this.generateRandomLongitude(),
            message: this.generateRandomMessage(),
            timestamp: new Date()
        };
    }
}

export default LocationAlertService;