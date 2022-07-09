const Order = require("../entities/order");
// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageOrdersUsecase {
  constructor(ordersRepository) {
    this.ordersRepository = ordersRepository;
  }

  async getOrders() {
    const orders = await this.ordersRepository.getOrders();
    return await this.buildOrder(orders);
  }

  async getOrder(id) {
    const orders = await this.ordersRepository.getOrders(id);
    return await this.buildOrder(orders);
  }

  async buildOrder(data) {
    const listOfOrders = data.map((order) => {
      const details = JSON.parse(order.details);
      const listOfProducts = details.map((detail) => ({
        id: detail.productId,
        name: detail.name,
        quantity: detail.productQuantity,
        sku: detail.productSku,
      }));

      return {
        order: {
          id: order.orderId,
          status: order.status,
          products: listOfProducts,
        },
        origin: {
          name: order.storeName,
          address: order.warehouseAddress,
        },
      };
    });
    return listOfOrders;
  }

  async createOrder(data) {
    // create New Order
    const order = new Order(undefined, data.storeId, data.userId, "created");
    const id = await this.ordersRepository.createOrder(order);
    order.id = id;
    return order;
  }

  async updateOrder(id, data) {
    // update order
    const validateStatus = await this.validateStatus(id, data);
    if (validateStatus.code !== 200) {
      return validateStatus;
    }
    const order = new Order(id, data.storeId, data.userId, data.status);
    await this.ordersRepository.updateOrder(order);
    const getOrderInfo = await this.getOrder(id);
    console.log({
      getOrderInfo,
    });
    return {
      code: 200,
      order: getOrderInfo,
      message: "Order status updated",
    };
  }

  async deleteOrder(id) {
    await this.ordersRepository.deleteOrder(id);
  }

  async validateStatus(id, data) {
    const getOrder = await this.ordersRepository.getOrder(id);
    const currentOrderStatus = getOrder.status;

    // validate the order of the current status is the correct
    const STATUS_ORDER = ["created", "confirmed", "dispatched", "delivered"];

    if (
      STATUS_ORDER.indexOf(currentOrderStatus) + 1 !==
        STATUS_ORDER.indexOf(data?.status) &&
      data?.status !== "cancel"
    ) {
      return {
        code: 409,
        order: getOrder,
        message:
          "Order status can't be changed, because it's not the next status of the order",
      };
    }

    // validate if the order is not dispached to the customer in order to allow cancel it
    if (
      data?.status === "cancel" &&
      (getOrder.status !== "created" || getOrder.status !== "confirmed")
    ) {
      return {
        code: 409,
        order: getOrder,
        message:
          "Order can't be canceled, because it's dispached to the customer",
      };
    }
    return {
      code: 200,
      order: getOrder,
      message: true,
    };
  }
}

module.exports = ManageOrdersUsecase;
