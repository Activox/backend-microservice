const express = require('express');
const appRoot = require('app-root-path');
const OrderDetail = require('../entities/orderdetail');
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

function createOrderDetailsRouter(manageOrderDetailsUsecase) {

  const router = express.Router();

  router.get("/orderdetails", async (req, res) => {

    const orderdetails = await manageOrderDetailsUsecase.getOrderDetails();
    res.status(200).send(orderdetails);

  });

  router.get("/orderdetails/:id", async (req, res) => {

    const id = req.params.id;
    const orderdetail = await manageOrderDetailsUsecase.getOrderDetail(id);
    
    res.status(200).send(orderdetail);
    
  });
  
  router.post("/orderdetails", async (req, res) => {
    
    validation = validateSchema(OrderDetail.schema, req);
    
    if (validation === true) {
      const orderdetail = await manageOrderDetailsUsecase.createOrderDetail(req.body);
      res.status(201).send(orderdetail);
    } else {
      res.status(422).send(validation)
    }

  });

  router.put("/orderdetails/:id", async (req, res) => {
    
    validation = validateSchema(OrderDetail.schema, req);
    
    if (validation === true) {
      const id = req.params.id;
      const orderdetail = await manageOrderDetailsUsecase.updateOrderDetail(id, req.body);
      res.status(200).send(orderdetail);
    } else {
      res.status(422).send(validation);
    }

  });

  router.delete("/orderdetails/:id", async (req, res) => {

    const id = req.params.id;
    await manageOrderDetailsUsecase.deleteOrderDetail(id);

    res.status(200).send(`Deleted ${id}`);

  });

  return router;

}

module.exports = createOrderDetailsRouter;