const SequelizeClient = require("./frameworks/db/sequelize");

const ManageDeliveriesUsecase = require("./deliveries/usecases/manage-deliveries-usecase");
const SequelizeDeliveriesRepository = require("./deliveries/repositories/sequelize-deliveries-repository");

const ManageTrackingLogsUsecase = require("./trackingLogs/usecases/manage-trackingLogs-usecase");
const SequelizeTrackingLogsRepository = require("./trackingLogs/repositories/sequelize-trackingLogs-repository");

const sequelizeClient = new SequelizeClient();
const sequelizeDeliveriesRepository = new SequelizeDeliveriesRepository(
  sequelizeClient
);
const sequelizeTrackingLogsRepository = new SequelizeTrackingLogsRepository(
  sequelizeClient
);
sequelizeClient.syncDatabase();

const manageDeliveriesUsecase = new ManageDeliveriesUsecase(
  sequelizeDeliveriesRepository
);
const manageTrackingLogsUsecase = new ManageTrackingLogsUsecase(
  sequelizeTrackingLogsRepository
);

module.exports = {
  manageDeliveriesUsecase,
  manageTrackingLogsUsecase,
};
