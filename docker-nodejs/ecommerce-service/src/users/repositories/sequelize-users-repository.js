const { DataTypes } = require("sequelize");

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
}

module.exports = SequelizeUsersRepository;
