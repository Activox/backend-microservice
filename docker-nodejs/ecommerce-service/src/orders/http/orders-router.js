const express = require("express");
const appRoot = require("app-root-path");
const Order = require("../entities/order");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");
const axios = require("axios");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

const {
  manageOrderDetailsUsecase,
  manageProductsUsecase,
  manageStoresUsecase,
  manageUsersUsecase,
} = require("../../routersUsecase");

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

    if (!validation) {
      res.status(422).send(validation);
    }

    try {
      const listOfProducts = req.body.products;

      // Validate if Store has Warehouse Address
      const storeId = req.body.storeId;
      const store = await manageStoresUsecase.getStore(storeId);
      if (!store) {
        res.status(404).send({
          mesage: "Store not found",
        });
      }
      if (!store.warehouseAddress) {
        return res.status(409).send({
          message: "This Store has no Warehouse Address.",
        });
      }

      // Validate if User is Marketplace User
      const userId = req.body.userId;
      const userInfo = await manageUsersUsecase.getUser(userId);
      if (!userInfo) {
        return res.status(404).send({
          message: "User not found.",
        });
      }
      const userType = userInfo.type;
      if (userType.toLowerCase() !== "marketplace user") {
        return res.status(409).send({
          message:
            "User mest be a Marketplace User in order to create an Order.",
        });
      }
      // Validate the quantity of each product
      const productsWithExceedQty =
        await manageProductsUsecase.validateProductsStock(listOfProducts);
      if (productsWithExceedQty.length > 0) {
        return res.status(409).send({
          message: `This Order exceed the stock quantity of ${productsWithExceedQty[0].name}`,
        });
      }

      // Create Order
      const order = await manageOrdersUsecase.createOrder(req.body);

      // create Order Details
      const listOfOrderDetails =
        await manageOrderDetailsUsecase.createOrderDetail({
          orderId: order.id,
          listOfProducts,
        });

      // Update the quantity of each product
      await manageProductsUsecase.updateQuantity(listOfProducts);

      // assign details to order and return order
      order.details = listOfOrderDetails;
      res.status(201).send(order);
    } catch (error) {
      return res
        .status(500)
        .send({ message: error.message, stack: error.stack });
    }
  });

  router.put("/orders/:id", async (req, res) => {
    const id = req.params.id;

    validation = validateSchema(Order.schema, req);

    if (!validation) {
      res.status(422).send(validation);
    }

    const order = await manageOrdersUsecase.updateOrder(id, req.body);
    res.status(200).send(order);
  });

  router.delete("/orders/:id", async (req, res) => {
    const id = req.params.id;
    await manageOrdersUsecase.deleteOrder(id);

    res.status(200).send(`Deleted ${id}`);
  });

  router.put("/orders/:id/status", async (req, res) => {
    const id = req.params.id;
    let deliveryInfo = null;
    if (req.body?.status === "cancel") {
      const order = await manageOrdersUsecase.getOrder(id);
      // Update the quantity of each product
      await manageProductsUsecase.updateQuantity(order.products, "add");
    }

    if (req.body?.status === "dispatched") {
      try {
        const response = await axios.post(
          `${process.env.ECOMMERCE_API_BASE_DOMAIN}/deliverys`,
          {
            orderId: id,
          }
        );
        deliveryInfo = response.data;
      } catch (error) {
        return res.status(500).send(error);
      }
    }
    const { code, order, message } = await manageOrdersUsecase.updateOrder(
      id,
      req.body
    );
    const orderInfo = {
      order: order[0].order,
      origin: order[0].origin,
      trackingNumber: deliveryInfo?.trackingNumber,
      status: deliveryInfo?.status,
    };

    res.status(code).send(code === 200 ? orderInfo : message);
  });

  return router;
}

module.exports = createOrdersRouter;
