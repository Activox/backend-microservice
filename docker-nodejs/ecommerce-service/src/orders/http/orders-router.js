const express = require('express');
const appRoot = require('app-root-path');
const Order = require('../entities/order');
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

function createOrdersRouter(manageOrdersUsecase) {

  const router = express.Router();

  router.get("/orders", async (req, res) => {

    const orders = await manageOrdersUsecase.getOrders();
    res.status(200).send(orders);

  });

  router.get("/orders/:id", async (req, res) => {

    const id = req.params.id;
    const order = await manageOrdersUsecase.getOrder(id);
    
    res.status(200).send(order);
    
  });
  
  router.post("/orders", async (req, res) => {
    
    validation = validateSchema(Order.schema, req);
    
    if (validation === true) {
      const order = await manageOrdersUsecase.createOrder(req.body);
      res.status(201).send(order);
    } else {
      res.status(422).send(validation)
    }

  });

  router.put("/orders/:id", async (req, res) => {
    
    validation = validateSchema(Order.schema, req);
    
    if (validation === true) {
      const id = req.params.id;
      const order = await manageOrdersUsecase.updateOrder(id, req.body);
      res.status(200).send(order);
    } else {
      res.status(422).send(validation);
    }

  });

  router.delete("/orders/:id", async (req, res) => {

    const id = req.params.id;
    await manageOrdersUsecase.deleteOrder(id);

    res.status(200).send(`Deleted ${id}`);

  });

  return router;

}

module.exports = createOrdersRouter;