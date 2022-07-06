const OrderDetail = require("../entities/orderdetail");

// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageOrderDetailsUsecase {
  constructor(orderdetailsRepository) {
    this.orderdetailsRepository = orderdetailsRepository;
  }

  async getOrderDetails() {
    return await this.orderdetailsRepository.getOrderDetails();
  }

  async getOrderDetail(id) {
    return await this.orderdetailsRepository.getOrderDetail(id);
  }

  async createOrderDetail(data) {
    const orderdetail = new OrderDetail(
      undefined,
      data.orderId,
      data.productId,
      data.quantity
    );
    const id = await this.orderdetailsRepository.createOrderDetail(orderdetail);
    orderdetail.id = id;

    return orderdetail;
  }

  async updateOrderDetail(id, data) {
    const orderdetail = new OrderDetail(
      id,
      data.orderId,
      data.productId,
      data.quantity
    );
    await this.orderdetailsRepository.updateOrderDetail(orderdetail);

    return orderdetail;
  }

  async deleteOrderDetail(id) {
    await this.orderdetailsRepository.deleteOrderDetail(id);
  }
}

module.exports = ManageOrderDetailsUsecase;
