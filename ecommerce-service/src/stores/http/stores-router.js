const express = require("express");
const appRoot = require("app-root-path");
const Store = require("../entities/store");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de Tiendas.
// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

const { manageUsersUsecase } = require("../../routersUsecase");

function createStoresRouter(manageStoresUsecase) {
  const router = express.Router();

  router.get("/stores", async (req, res) => {
    const stores = await manageStoresUsecase.getStores();
    res.status(200).send(stores);
  });

  router.get("/stores/:id", async (req, res) => {
    const id = req.params.id;
    const store = await manageStoresUsecase.getStore(id);

    res.status(200).send(store);
  });

  router.post("/stores", async (req, res) => {
    // Validate schema.
    validation = validateSchema(Store.schema, req);
    if (!validation) {
      return res.status(422).send(validation);
    }

    // Validate that user exists.
    const userId = req.body.userId;
    const userInfo = await manageUsersUsecase.getUser(userId);
    if (!userInfo) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    // validate if the user is admin.
    const userType = userInfo.type;
    if (userType.toLowerCase() !== "marketplace administrator") {
      return res.status(403).send({
        message:
          "To create a store, the user must be a marketplace administrator.",
      });
    }

    // validate store name is unique
    const storeName = req.body.name;
    const isStoreNameTaken = await manageStoresUsecase.getStoreByName(
      storeName
    );
    if (isStoreNameTaken) {
      return res.status(409).send({
        message: "Store name already exists",
      });
    }
    // Create store.
    const store = await manageStoresUsecase.createStore(req.body);
    return res.status(201).send(store);
  });

  router.put("/stores/:id", async (req, res) => {
    validation = validateSchema(Store.schema, req);
    if (!validation) {
      return res.status(422).send(validation);
    }
    const id = req.params.id;
    const store = await manageStoresUsecase.updateStore(id, req.body);
    return res.status(200).send(store);
  });

  router.delete("/stores/:id", async (req, res) => {
    const id = req.params.id;
    await manageStoresUsecase.deleteStore(id);

    res.status(200).send(`Deleted ${id}`);
  });

  return router;
}

module.exports = createStoresRouter;
