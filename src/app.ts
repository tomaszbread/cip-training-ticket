
import express from 'express';
import locationAlertRoutes from './routes/locationAlertRoutes';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/location-alerts', locationAlertRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});