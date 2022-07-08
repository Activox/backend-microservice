const Product = require("../entities/product");

// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageProductsUsecase {
  constructor(productsRepository) {
    this.productsRepository = productsRepository;
  }

  async getProducts() {
    return await this.productsRepository.getProducts();
  }

  async getProduct(id) {
    return await this.productsRepository.getProduct(id);
  }

  async createProduct(data) {
    const product_name = data.name.split(" ");
    let sku = product_name.map((value) => {
      return value.substring(0, 3).toUpperCase();
    });

    const product = new Product(
      undefined,
      data.name,
      data.description,
      data.quantity,
      sku.join(Math.floor(Math.random() * 10))
    );
    const id = await this.productsRepository.createProduct(product);
    product.id = id;

    return product;
  }

  async updateProduct(id, data) {
    const product = new Product(
      id,
      data.name,
      data.description,
      data.quantity,
      data.sku
    );
    await this.productsRepository.updateProduct(product);

    return product;
  }

  async deleteProduct(id) {
    await this.productsRepository.deleteProduct(id);
  }

  async isProductExist(name) {
    await this.productsRepository.getProductByName(name);
  }

  async validateProductsStock(listOfProducts) {
    const productsOutStock = await Promise.all(
      await listOfProducts.map(async (product) => {
        const productInfo = await this.productsRepository.getProduct(
          product.id
        );
        return {
          isExceedQty: product.quantity > productInfo.quantity,
          name: productInfo.name,
        };
      })
    );

    return productsOutStock.filter((product) => product.isExceedQty);
  }
}

module.exports = ManageProductsUsecase;
