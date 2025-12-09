import express from 'express';
import { vehicleController } from './vehicles.controller';
import auth from '../../middleware/auth';
import { Role } from '../../types/roles.type';

const router = express.Router();


router.post('/api/v1/vehicles',auth(Role.admin),vehicleController.createVehicles);

router.get('/api/v1/vehicles',vehicleController.getAllVehicles);

router.get('/api/v1/vehicles/:vehicleId',vehicleController.getVehicleById);

router.put('/api/v1/vehicles/:vehicleId',auth(Role.admin),vehicleController.updateVehicleById);

router.delete('/api/v1/vehicles/:vehicleId',auth(Role.admin),vehicleController.deleteVehicleById)

export const vehicleRoutes = router;