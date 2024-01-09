import { MappingTypeMapping } from "@elastic/elasticsearch/lib/api/types";

interface LocationAlert {
    id: string;
    userId: string;
    latitude: number;
    longitude: number;
    message: string;
    timestamp: number;
}

export const locationAlertMapping: MappingTypeMapping = {
    properties: {
        id: { type: "text" },
        userId: { type: "text" },
        timestamp: { type: "long" },
        message: { type: "text" },
        latitude: { type: "long" },
        longitude: { type: "long" },
    }
};

export default LocationAlert;