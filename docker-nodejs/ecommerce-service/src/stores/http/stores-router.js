const express = require("express");
const appRoot = require("app-root-path");
const Store = require("../entities/store");
const validateSchema = require(appRoot + "/src/frameworks/http/ajv");

// Router (endpoints) para la sección de libros.

// Sólo se encarga de recibir las llamadas HTTP y le entrega los datos
// relevantes a los casos de uso correspondiente. Esta capa no debe
// contener lógica de negocio, sólo lo necesario para recibir y entregar
// respuestas válidas.

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
