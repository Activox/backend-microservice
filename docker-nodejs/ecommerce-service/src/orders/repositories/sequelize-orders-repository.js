const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeOrdersRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla Order.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "Orders";

    if (test) {
      tableName += "_test";
    }

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      storeId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      status: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.orderModel = sequelizeClient.sequelize.define(
      "Order",
      columns,
      options
    );
  }

  async getOrders() {
    const orders = await this.orderModel.findAll({
      raw: true,
    });

    return orders;
  }

  async getOrder(id) {
    return await this.orderModel.findByPk(id);
  }

  async createOrder(order) {
    const data = await this.orderModel.create(order);
    return data.id;
  }

  async updateOrder(order) {
    const options = {
      where: {
        id: order.id,
      },
    };

    await this.orderModel.update(order, options);
  }

  async deleteOrder(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.orderModel.destroy(options);
  }

  async deleteAllOrders() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.orderModel.destroy(options);
    }
  }

  async dropOrdersTable() {
    if (this.test) {
      await this.orderModel.drop();
    }
  }
}

module.exports = SequelizeOrdersRepository;
