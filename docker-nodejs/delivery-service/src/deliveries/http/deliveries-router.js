const express = require("express");
const appRoot = require("app-root-path");
const Delivery = require("../entities/delivery");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

function createDeliverysRouter(manageDeliverysUsecase) {
  const router = express.Router();

  router.get("/deliverys", async (req, res) => {
    const deliverys = await manageDeliverysUsecase.getDeliverys();
    res.status(200).send(deliverys);
  });

  router.get("/deliverys/:id", async (req, res) => {
    const id = req.params.id;
    const delivery = await manageDeliverysUsecase.getDelivery(id);

    res.status(200).send(delivery);
  });

  router.post("/deliverys", async (req, res) => {
    validation = validateSchema(Delivery.schema, req);
    if (!validation) {
      res.status(422).send(validation);
    }
    console.log(req.body);
    const delivery = await manageDeliverysUsecase.createDelivery(req.body);
    console.log({ delivery });
    res.status(201).send(delivery);
  });

  router.put("/deliverys/:id", async (req, res) => {
    validation = validateSchema(Delivery.schema, req);

    if (validation === true) {
      const id = req.params.id;
      const delivery = await manageDeliverysUsecase.updateDelivery(
        id,
        req.body
      );
      res.status(200).send(delivery);
    } else {
      res.status(422).send(validation);
    }
  });

  router.delete("/deliverys/:id", async (req, res) => {
    const id = req.params.id;
    await manageDeliverysUsecase.deleteDelivery(id);

    res.status(200).send(`Deleted ${id}`);
  });

  return router;
}

module.exports = createDeliverysRouter;
