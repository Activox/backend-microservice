const { DataTypes, QueryTypes } = require("sequelize");

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

  async getOrder(id) {
    return await this.orderModel.findByPk(id);
  }

  async getOrders(id = null) {
    const where = id ? `WHERE Orders.id = '${id}'` : ``;
    const orders = await this.sequelizeClient.sequelize.query(
      `
        SELECT 
            Orders.id as orderId,
            Stores.id as storeId,
            Stores.name as storeName,
            Stores.warehouseAddress,
            Orders.id as orderId,
            Orders.status,
            concat( '[',
                      group_concat(
                        (
                            json_object('orderDetailId', OrderDetails.id, 'name',Products.name, 'productQuantity', OrderDetails.quantity, 'productSku', Products.sku, 'productId', Products.id)
                        )
                      ), ']'
            ) as details
        FROM Orders
        inner join Stores on Orders.storeId = Stores.id
        inner join OrderDetails on Orders.id = OrderDetails.orderId
        inner join Products on OrderDetails.productId = Products.id
        ${where}
        group by Stores.id, Stores.name, Stores.warehouseAddress, Orders.id, Orders.status;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );
    return orders;
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
