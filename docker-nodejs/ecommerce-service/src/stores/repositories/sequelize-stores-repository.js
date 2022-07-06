const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeStoresRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla Store.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "Stores";

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
      description: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      warehouseAddress: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.storeModel = sequelizeClient.sequelize.define(
      "Store",
      columns,
      options
    );
  }

  async getStores() {
    const stores = await this.storeModel.findAll({
      raw: true,
    });

    return stores;
  }

  async getStoreByName(name) {
    const options = {
      where: {
        name: name,
      },
    };

    return await this.storeModel.findOne(options);
  }

  async getStore(id) {
    return await this.storeModel.findByPk(id);
  }

  async createStore(store) {
    const data = await this.storeModel.create(store);
    return data.id;
  }

  async updateStore(store) {
    const options = {
      where: {
        id: store.id,
      },
    };

    await this.storeModel.update(store, options);
  }

  async deleteStore(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.storeModel.destroy(options);
  }

  async deleteAllStores() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.storeModel.destroy(options);
    }
  }

  async dropStoresTable() {
    if (this.test) {
      await this.storeModel.drop();
    }
  }
}

module.exports = SequelizeStoresRepository;
