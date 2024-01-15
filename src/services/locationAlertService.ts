
import { Client } from '@elastic/elasticsearch';
import ElasticConfig from '../config/elasticConfig';
import LocationAlert from '../models/locationAlert';

class LocationAlertService {
    private elasticConfig: ElasticConfig;
    public elasticClient: Client;
    private indexName = 'location-alert';

    constructor() {
        this.elasticConfig = new ElasticConfig();
        this.elasticClient = this.elasticConfig.getClient();
    }
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
        const randomNum = Math.floor(Math.random() * 100);
        return `Alert ${randomNum}`;
    }

    generateRandomLocationAlert(): LocationAlert {
        return {
            id: this.generateUniqueId(),
            userId: this.generateRandomUserId(),
            latitude: this.generateRandomLatitude(),
            longitude: this.generateRandomLongitude(),
            message: this.generateRandomMessage(),
            timestamp: new Date().getTime()
        };
    }

    async saveLocationAlertToElasticSearch(locationAlert: LocationAlert) {
        try {
            const response = await this.elasticClient.index({
                index: this.indexName,
                body: locationAlert,
            });
            console.log('Data saved to Elasticsearch:', response.result);
        } catch (error) {
            console.error('Error saving data to Elasticsearch:', error);
            throw error;
        }
    }

    async fetchLocationAlertData() {
        try {
            const index = this.indexName;
            const query = {
                query: {
                    match_all: {}
                }
            };

            const body = await this.elasticClient.search({ index, body: query });
            return body.hits.hits;
        } catch (error) {
            console.error('Error fetching data from Elasticsearch:', error);
            throw error;
        }
    }


}

export default LocationAlertService;