import { Router } from "express";
import locationController from "../controller/location.controller.js";

const locationRouter = Router();
locationRouter.post('/', locationController.addLocation)
locationRouter.get('/', locationController.queryLocation)
locationRouter.delete('/', locationController.deleteLocation)

export default locationRouter;