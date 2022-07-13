const Delivery = require("../entities/delivery");

// Casos de uso para el manejo de libros.
// Acá va la lógica de negocio agnóstica a los frameworks,
// recibiendo como parámetros las dependencias necesarias.

class ManageDeliverysUsecase {
  constructor(deliverysRepository) {
    this.deliverysRepository = deliverysRepository;
  }

  async getDeliverys() {
    return await this.deliverysRepository.getDeliverys();
  }

  async getDelivery(id) {
    return await this.deliverysRepository.getDelivery(id);
  }

  async createDelivery(data) {
    const trackingNumber = Math.random().toString(36).slice(2);
    const delivery = new Delivery(
      undefined,
      data.orderId,
      "READY_FOR_PICK_UP",
      trackingNumber.toUpperCase()
    );
    const id = await this.deliverysRepository.createDelivery(delivery);
    delivery.id = id;

    return delivery;
  }

  async updateDelivery(id, data) {
    const delivery = new Delivery(
      id,
      data.orderId,
      data.status,
      data.trackingNumber
    );
    await this.deliverysRepository.updateDelivery(delivery);

    return delivery;
  }

  async deleteDelivery(id) {
    await this.deliverysRepository.deleteDelivery(id);
  }

  async getTrackingLogs({ orderId, trackingNumber }) {
    const deliveryTracking =
      await this.deliverysRepository.getDeliveryTrackingLogs(
        orderId,
        trackingNumber
      );

    const deliveryInfo = deliveryTracking[0];
    deliveryInfo.tracking = JSON.parse(deliveryInfo.tracking);

    return deliveryInfo;
  }
}

module.exports = ManageDeliverysUsecase;
