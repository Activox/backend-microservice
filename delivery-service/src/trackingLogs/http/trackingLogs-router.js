const express = require("express");
const appRoot = require("app-root-path");
const TrackingLogs = require("../entities/trackingLog");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

function createTrackingLogsRouter(manageTrackingLogsUsecase) {
  const router = express.Router();

  router.get("/trackingLogs", async (req, res) => {
    const trackingLogs = await manageTrackingLogsUsecase.getTrackingLogs();
    res.status(200).send(trackingLogs);
  });

  router.get("/trackingLogs/:id", async (req, res) => {
    const id = req.params.id;
    const trackingLogs = await manageTrackingLogsUsecase.getTrackingLogs(id);

    res.status(200).send(trackingLogs);
  });

  router.post("/trackingLogs", async (req, res) => {
    validation = validateSchema(TrackingLogs.schema, req);

    if (validation === true) {
      const trackingLogs = await manageTrackingLogsUsecase.createTrackingLogs(
        req.body
      );
      res.status(201).send(trackingLogs);
    } else {
      res.status(422).send(validation);
    }
  });

  router.put("/trackingLogs/:id", async (req, res) => {
    validation = validateSchema(TrackingLogs.schema, req);

    if (validation === true) {
      const id = req.params.id;
      const trackingLogs = await manageTrackingLogsUsecase.updateTrackingLogs(
        id,
        req.body
      );
      res.status(200).send(trackingLogs);
    } else {
      res.status(422).send(validation);
    }
  });

  router.delete("/trackingLogs/:id", async (req, res) => {
    const id = req.params.id;
    await manageTrackingLogsUsecase.deleteTrackingLogs(id);

    res.status(200).send(`Deleted ${id}`);
  });

  return router;
}

module.exports = createTrackingLogsRouter;
