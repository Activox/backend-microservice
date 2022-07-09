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
    const listOfDetails = await data.listOfProducts.map(async (product) => {
      return new OrderDetail(data.orderId, product.productId, product.quantity);
    });

    const listOfDetailsSaved = await Promise.all(
      await listOfDetails.map(async (detail) => {
        const id = await this.orderdetailsRepository.createOrderDetail(detail);
        detail.id = id;
        return detail;
      })
    );

    return listOfDetailsSaved;
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
