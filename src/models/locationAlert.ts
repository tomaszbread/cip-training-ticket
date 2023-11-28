interface LocationAlert {
    id: string;
    userId: string;
    location: {
        latitude: number;
        longitude: number;
    };
    message: string;
    timestamp: Date;
}

export default LocationAlert;