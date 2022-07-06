const Order = require("../entities/order");

// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageOrdersUsecase {
  constructor(ordersRepository) {
    this.ordersRepository = ordersRepository;
  }

  async getOrders() {
    return await this.ordersRepository.getOrders();
  }

  async getOrder(id) {
    return await this.ordersRepository.getOrder(id);
  }

  async createOrder(data) {
    const order = new Order(undefined, data.storeId, data.userId, data.status);
    const id = await this.ordersRepository.createOrder(order);
    order.id = id;

    return order;
  }

  async updateOrder(id, data) {
    const order = new Order(id, data.storeId, data.userId, data.status);
    await this.ordersRepository.updateOrder(order);

    return order;
  }

  async deleteOrder(id) {
    await this.ordersRepository.deleteOrder(id);
  }
}

module.exports = ManageOrdersUsecase;
