const { DataTypes } = require("sequelize");

// Implementación con Sequelize para el repositorio de libros.
// Recibe la conexión con Sequelize externamente.

class SequelizeProductsRepository {
  constructor(sequelizeClient, test = false) {
    this.sequelizeClient = sequelizeClient;
    this.test = test;

    // Mapear la tabla Product.
    // Si "test" es true, se le agrega un sufijo al nombre de la tabla,
    // para que las pruebas de integración no sobreescriban los datos existentes.

    let tableName = "Products";

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
      quantity: DataTypes.INTEGER,
      sku: DataTypes.STRING,
    };

    const options = {
      tableName: tableName,
      timestamps: false,
    };

    this.productModel = sequelizeClient.sequelize.define(
      "Product",
      columns,
      options
    );
  }

  async getProducts() {
    const products = await this.productModel.findAll({
      raw: true,
    });

    return products;
  }

  async getProductByName(name) {
    const options = {
      where: {
        name: name,
      },
    };

    return await this.productModel.findOne(options);
  }

  async getProduct(id) {
    return await this.productModel.findByPk(id);
  }

  async createProduct(product) {
    const data = await this.productModel.create(product);
    return data.id;
  }

  async updateProduct(product) {
    const options = {
      where: {
        id: product.id,
      },
    };

    await this.productModel.update(product, options);
  }

  async deleteProduct(id) {
    const options = {
      where: {
        id: id,
      },
    };

    await this.productModel.destroy(options);
  }

  async deleteAllProducts() {
    if (this.test) {
      const options = {
        truncate: true,
      };

      await this.productModel.destroy(options);
    }
  }

  async dropProductsTable() {
    if (this.test) {
      await this.productModel.drop();
    }
  }
}

module.exports = SequelizeProductsRepository;
