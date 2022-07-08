const express = require("express");
const appRoot = require("app-root-path");
const Order = require("../entities/order");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

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
      listOfProducts.forEach(async (product) => {
        const productInfo = await manageProductsUsecase.getProduct(product.id);
        const newQuantity = productInfo.quantity - product.quantity;
        await manageProductsUsecase.updateProduct(product.id, {
          quantity: newQuantity,
        });
      });

      order.details = listOfOrderDetails;
      res.status(201).send(order);
    } catch (error) {
      return res
        .status(500)
        .send({ message: error.message, stack: error.stack });
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
