const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeDeliverysRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla Delivery.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "Deliverys";

    if (test) {
      tableName += "_test";
    }

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      orderId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      trackingNumber: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.deliveryModel = sequelizeClient.sequelize.define(
      "Delivery",
      columns,
      options
    );
  }

  async getDeliverys() {
    const deliverys = await this.deliveryModel.findAll({
      raw: true,
    });

    return deliverys;
  }

  async getDelivery(id) {
    return await this.deliveryModel.findByPk(id);
  }

  async createDelivery(delivery) {
    const data = await this.deliveryModel.create(delivery);
    return data.id;
  }

  async updateDelivery(delivery) {
    const options = {
      where: {
        id: delivery.id,
      },
    };

    await this.deliveryModel.update(delivery, options);
  }

  async deleteDelivery(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.deliveryModel.destroy(options);
  }

  async deleteAllDeliverys() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.deliveryModel.destroy(options);
    }
  }

  async dropDeliverysTable() {
    if (this.test) {
      await this.deliveryModel.drop();
    }
  }
}

module.exports = SequelizeDeliverysRepository;
