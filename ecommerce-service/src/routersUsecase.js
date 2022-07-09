const SequelizeClient = require("./frameworks/db/sequelize");

const ManageUsersUsecase = require("./users/usecases/manage-users-usecase");
const SequelizeUsersRepository = require("./users/repositories/sequelize-users-repository");

const ManageStoresUsecase = require("./stores/usecases/manage-stores-usecase");
const SequelizeStoresRepository = require("./stores/repositories/sequelize-stores-repository");

const ManageProductsUsecase = require("./products/usecases/manage-products-usecase");
const SequelizeProductsRepository = require("./products/repositories/sequelize-products-repository");

const ManageOrdersUsecase = require("./orders/usecases/manage-orders-usecase");
const SequelizeOrdersRepository = require("./orders/repositories/sequelize-orders-repository");

const ManageOrderDetailsUsecase = require("./orderDetails/usecases/manage-orderDetails-usecase");
const SequelizeOrderDetailsRepository = require("./orderDetails/repositories/sequelize-orderDetails-repository");

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

module.exports = {
  manageUsersUsecase,
  manageStoresUsecase,
  manageProductsUsecase,
  manageOrdersUsecase,
  manageOrderDetailsUsecase,
};
