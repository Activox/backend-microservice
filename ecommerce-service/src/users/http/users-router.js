const express = require("express");
const appRoot = require("app-root-path");
const User = require("../entities/user");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

function createUsersRouter(manageUsersUsecase) {
  const router = express.Router();

  router.get("/users", async (req, res) => {
    const users = await manageUsersUsecase.getUsers();
    res.status(200).send(users);
  });

  router.get("/users/:id", async (req, res) => {
    const id = req.params.id;
    const user = await manageUsersUsecase.getUser(id);

    res.status(200).send(user);
  });

  router.post("/users", async (req, res) => {
    // Validate Schema of the body
    let validation = validateSchema(User.schema, req);
    if (!validation) {
      return res.status(422).send(validation);
    }

    // validate if the userType is valid
    const userType = req.body.type;
    const USER_TYPE = {
      "marketplace user": true,
      "store user": true,
      "marketplace administrator": true,
    };
    if (!USER_TYPE[userType.toLowerCase()]) {
      return res.status(409).send({
        message: `Invalid user type. User must be one of: ${Object.keys(
          USER_TYPE
        )}`,
      });
    }

    // validate if userType is "marketplace user" and shippingAddress is not provided
    const shippingAddress = req.body.shippingAddress;
    if (!shippingAddress && userType.toLowerCase() === "marketplace user") {
      return res.status(409).send({
        message: "shippingAddress is required for Marketplace User",
      });
    }

    // validate if email is not unique
    const userEmail = req.body.email;
    const validateUserEmail = await manageUsersUsecase.validateUserEmail(
      userEmail
    );
    if (validateUserEmail) {
      return res.status(409).send({ message: "Email already exists" });
    }

    // create user
    const user = await manageUsersUsecase.createUser(req.body);
    return res.status(201).send(user);
  });

  router.put("/users/:id", async (req, res) => {
    validation = validateSchema(User.schema, req);

    if (validation === true) {
      const id = req.params.id;
      const user = await manageUsersUsecase.updateUser(id, req.body);
      res.status(200).send(user);
    } else {
      res.status(422).send(validation);
    }
  });

  router.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    await manageUsersUsecase.deleteUser(id);

    res.status(200).send(`Deleted ${id}`);
  });

  router.get("/users/:id/orders", async (req, res) => {
    const id = req.params.id;
    const orders = await manageUsersUsecase.getUserOrders(id);
    res.status(200).send(orders);
  });

  return router;
}

module.exports = createUsersRouter;
