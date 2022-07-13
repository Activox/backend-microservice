const express = require("express");
const appRoot = require("app-root-path");
const Delivery = require("../entities/delivery");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

const { manageTrackingLogsUsecase } = require("../../routersUsecase");

function createDeliverysRouter(manageDeliverysUsecase) {
  const router = express.Router();

  router.get("/deliverys", async (req, res) => {
    const deliverys = await manageDeliverysUsecase.getDeliverys();
    res.status(200).send(deliverys);
  });

  router.get("/deliverys/tracking", async (req, res) => {
    const tracking = await manageDeliverysUsecase.getTrackingLogs(req.body);
    res.status(200).send(tracking);
  });

  router.post("/deliverys", async (req, res) => {
    validation = validateSchema(Delivery.schema, req);
    if (!validation) {
      res.status(422).send(validation);
    }

    const delivery = await manageDeliverysUsecase.createDelivery(req.body);

    const trackingBody = {
      deliveryId: delivery.id,
      status: "READY_FOR_PICK_UP",
    };

    await manageTrackingLogsUsecase.createTrackingLogs(trackingBody);

    res.status(201).send(delivery);
  });

  router.put("/deliverys/:id", async (req, res) => {
    validation = validateSchema(Delivery.schema, req);

    if (!validation) {
      res.status(422).send(validation);
    }

    const id = req.params.id;
    const delivery = await manageDeliverysUsecase.updateDelivery(id, req.body);

    const trackingBody = {
      deliveryId: id,
      status: req.body.status,
    };

    await manageTrackingLogsUsecase.createTrackingLogs(trackingBody);

    res.status(200).send(delivery);
  });

  router.delete("/deliverys/:id", async (req, res) => {
    const id = req.params.id;
    await manageDeliverysUsecase.deleteDelivery(id);

    res.status(200).send(`Deleted ${id}`);
  });

  return router;
}

module.exports = createDeliverysRouter;
