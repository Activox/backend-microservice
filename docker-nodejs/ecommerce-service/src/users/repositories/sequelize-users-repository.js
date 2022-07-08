const { DataTypes, QueryTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeUsersRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla User.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "Users";

    if (test) {
      tableName += "_test";
    }

    const columns = {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: DataTypes.STRING,
      type: DataTypes.STRING,
      email: DataTypes.STRING,
      shippingAddress: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.userModel = sequelizeClient.sequelize.define("User", columns, options);
  }

  async getUsers() {
    const users = await this.userModel.findAll({
      raw: true,
    });

    return users;
  }

  async validateUserEmail(email) {
    const users = await this.userModel.findAll({
      where: {
        email: email,
      },
    });

    return users.length > 0;
  }

  async getUser(id) {
    return await this.userModel.findByPk(id);
  }

  async createUser(user) {
    const data = await this.userModel.create(user);
    return data.id;
  }

  async updateUser(user) {
    const options = {
      where: {
        id: user.id,
      },
    };

    await this.userModel.update(user, options);
  }

  async deleteUser(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.userModel.destroy(options);
  }

  async deleteAllUsers() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.userModel.destroy(options);
    }
  }

  async dropUsersTable() {
    if (this.test) {
      await this.userModel.drop();
    }
  }

  async getUserOrders(id) {
    const orders = await this.sequelizeClient.sequelize.query(
      `
        select 
            Orders.id as orderId,
            Stores.id as storeId,
            Stores.name as storeName,
            Stores.warehouseAddress,
            Orders.id as orderId,
            Orders.status,
            buyerUser.id as buyerId,
            buyerUser.name as buyerName,
            buyerUser.email as buyerEmail,
            buyerUser.shippingAddress as buyerShippingAddress,
            concat( '[',
              group_concat(
                (
                    json_object('orderDetailId', OrderDetails.id, 'name',Products.name, 'productQuantity', OrderDetails.quantity, 'productSku', Products.sku)
                )
              ), ']'
            ) as details
        
        from Users
        inner join Stores on Users.id = Stores.userId
        inner join Orders on Stores.id = Orders.storeId
        inner join Users as buyerUser on Orders.userId = buyerUser.id
        inner join OrderDetails on Orders.id = OrderDetails.orderId
        inner join Products on OrderDetails.productId = Products.id
        where Users.id = '${id}'
        group by Stores.id, Stores.name, Stores.warehouseAddress, Orders.id, Orders.status, buyerUser.id, buyerUser.name, buyerUser.email, buyerUser.shippingAddress;
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    return orders;
  }
}

module.exports = SequelizeUsersRepository;
