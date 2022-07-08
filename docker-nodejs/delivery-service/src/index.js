const createExpressApp = require("./frameworks/http/express");

const createDeliveriesRouter = require("./deliveries/http/deliveries-router");
const createTrackingLogsRouter = require("./trackingLogs/http/trackingLogs-router");

// Instanciar dependencias.
// En el caso de uso de de libros, es es posible pasarle como parámetro el repositorio
// de Firestore o el repositorio con Sequelize, y en ambos casos debería funcionar,
// incluso si el cambio se hace mientras la aplicación está en ejecución.

const {
  manageDeliveriesUsecase,
  manageTrackingLogsUsecase,
} = require("./routersUsecase");

let routers = [
  createDeliveriesRouter(manageDeliveriesUsecase),
  createTrackingLogsRouter(manageTrackingLogsUsecase),
];

// Crear aplicación Express con dependencias inyectadas.

const app = createExpressApp(routers);
