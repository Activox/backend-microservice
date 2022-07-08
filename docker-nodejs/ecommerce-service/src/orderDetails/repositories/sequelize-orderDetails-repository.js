const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeOrderDetailsRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla OrderDetail.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "OrderDetails";

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
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.orderDetailModel = sequelizeClient.sequelize.define(
      "OrderDetail",
      columns,
      options
    );
  }

  async getOrderDetails() {
    const orderDetails = await this.orderDetailModel.findAll({
      raw: true,
    });

    return orderDetails;
  }

  async getOrderDetail(id) {
    return await this.orderDetailModel.findByPk(id);
  }

  async createOrderDetail(orderDetail) {
    const data = await this.orderDetailModel.create(orderDetail);
    return data.id;
  }

  async updateOrderDetail(orderDetail) {
    const options = {
      where: {
        id: orderDetail.id,
      },
    };

    await this.orderDetailModel.update(orderDetail, options);
  }

  async deleteOrderDetail(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.orderDetailModel.destroy(options);
  }

  async deleteAllOrderDetail() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.orderDetailModel.destroy(options);
    }
  }

  async dropOrderDetailsTable() {
    if (this.test) {
      await this.orderDetailModel.drop();
    }
  }
}

module.exports = SequelizeOrderDetailsRepository;
