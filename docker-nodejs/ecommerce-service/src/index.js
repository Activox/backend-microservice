const createExpressApp = require("./frameworks/http/express");
const createUsersRouter = require("./users/http/users-router");
const createStoresRouter = require("./stores/http/stores-router");
const createProductsRouter = require("./products/http/products-router");
const createOrdersRouter = require("./orders/http/orders-router");
const createOrderDetailsRouter = require("./orderdetails/http/orderdetails-router");

// Instanciar dependencias.
// En el caso de uso de de libros, es es posible pasarle como parámetro el repositorio
// de Firestore o el repositorio con Sequelize, y en ambos casos debería funcionar,
// incluso si el cambio se hace mientras la aplicación está en ejecución.

const {
  manageUsersUsecase,
  manageStoresUsecase,
  manageProductsUsecase,
  manageOrdersUsecase,
  manageOrderDetailsUsecase,
} = require("./routersUsecase");

let routers = [
  createUsersRouter(manageUsersUsecase),
  createStoresRouter(manageStoresUsecase),
  createProductsRouter(manageProductsUsecase),
  createOrdersRouter(manageOrdersUsecase),
  createOrderDetailsRouter(manageOrderDetailsUsecase),
];

// Crear aplicación Express con dependencias inyectadas.

const app = createExpressApp(routers);
