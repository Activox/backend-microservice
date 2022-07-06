const createExpressApp = require("./frameworks/http/express");
const SequelizeClient = require("./frameworks/db/sequelize");

const createUsersRouter = require("./users/http/users-router");
const ManageUsersUsecase = require("./users/usecases/manage-users-usecase");
const SequelizeUsersRepository = require("./users/repositories/sequelize-users-repository");

const createStoresRouter = require("./stores/http/stores-router");
const ManageStoresUsecase = require("./stores/usecases/manage-stores-usecase");
const SequelizeStoresRepository = require("./stores/repositories/sequelize-stores-repository");

const createProductsRouter = require("./products/http/products-router");
const ManageProductsUsecase = require("./products/usecases/manage-products-usecase");
const SequelizeProductsRepository = require("./products/repositories/sequelize-products-repository");

const createOrdersRouter = require("./orders/http/orders-router");
const ManageOrdersUsecase = require("./orders/usecases/manage-orders-usecase");
const SequelizeOrdersRepository = require("./orders/repositories/sequelize-orders-repository");

const createOrderDetailsRouter = require("./orderdetails/http/orderdetails-router");
const ManageOrderDetailsUsecase = require("./orderdetails/usecases/manage-orderdetails-usecase");
const SequelizeOrderDetailsRepository = require("./orderdetails/repositories/sequelize-orderdetails-repository");

// Instanciar dependencias.

// En el caso de uso de de libros, es es posible pasarle como parámetro el repositorio
// de Firestore o el repositorio con Sequelize, y en ambos casos debería funcionar,
// incluso si el cambio se hace mientras la aplicación está en ejecución.

const sequelizeClient = new SequelizeClient();
const sequelizeUsersRepository = new SequelizeUsersRepository(sequelizeClient);
const sequelizeStoresRepository = new SequelizeStoresRepository(
  sequelizeClient
);
const sequelizeProductsRepository = new SequelizeProductsRepository(
  sequelizeClient
);
const sequelizeOrdersRepository = new SequelizeOrdersRepository(
  sequelizeClient
);
const sequelizeOrderDetailsRepository = new SequelizeOrderDetailsRepository(
  sequelizeClient
);
sequelizeClient.syncDatabase();

const manageUsersUsecase = new ManageUsersUsecase(sequelizeUsersRepository);
const manageStoresUsecase = new ManageStoresUsecase(sequelizeStoresRepository);
const manageProductsUsecase = new ManageProductsUsecase(
  sequelizeProductsRepository
);
const manageOrdersUsecase = new ManageOrdersUsecase(sequelizeOrdersRepository);
const manageOrderDetailsUsecase = new ManageOrderDetailsUsecase(
  sequelizeOrderDetailsRepository
);

let routers = [
  createUsersRouter(manageUsersUsecase),
  createStoresRouter(manageStoresUsecase),
  createProductsRouter(manageProductsUsecase),
  createOrdersRouter(manageOrdersUsecase),
  createOrderDetailsRouter(manageOrderDetailsUsecase),
];

// Crear aplicación Express con dependencias inyectadas.

const app = createExpressApp(routers);
