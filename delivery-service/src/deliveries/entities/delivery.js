// Entidad libro.

class Delivery {
  static schema = {
    type: "object",
    properties: {
      orderId: { type: "string", errorMessage: "must be of string type" },
      status: { type: "string", errorMessage: "must be of string type" },
      trackingNumber: {
        type: "string",
        errorMessage: "must be of string type",
      },
    },
    required: ["orderId"],
    additionalProperties: false,
  };

  constructor(id, orderId, status, trackingNumber) {
    this.id = id;
    this.orderId = orderId;
    this.status = status;
    this.trackingNumber = trackingNumber;
  }
}

module.exports = Delivery;
