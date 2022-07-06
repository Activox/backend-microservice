const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeOrderDetailDetailsRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla OrderDetailDetail.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "OrderDetailDetails";

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

    this.orderdetaildetailModel = sequelizeClient.sequelize.define(
      "OrderDetailDetail",
      columns,
      options
    );
  }

  async getOrderDetailDetails() {
    const orderdetaildetails = await this.orderdetaildetailModel.findAll({
      raw: true,
    });

    return orderdetaildetails;
  }

  async getOrderDetailDetail(id) {
    return await this.orderdetaildetailModel.findByPk(id);
  }

  async createOrderDetailDetail(orderdetaildetail) {
    const data = await this.orderdetaildetailModel.create(orderdetaildetail);
    return data.id;
  }

  async updateOrderDetailDetail(orderdetaildetail) {
    const options = {
      where: {
        id: orderdetaildetail.id,
      },
    };

    await this.orderdetaildetailModel.update(orderdetaildetail, options);
  }

  async deleteOrderDetailDetail(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.orderdetaildetailModel.destroy(options);
  }

  async deleteAllOrderDetailDetails() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.orderdetaildetailModel.destroy(options);
    }
  }

  async dropOrderDetailDetailsTable() {
    if (this.test) {
      await this.orderdetaildetailModel.drop();
    }
  }
}

module.exports = SequelizeOrderDetailDetailsRepository;
