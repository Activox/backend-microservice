// Entidad libro.

class Delivery {
  static schema = {
    type: "object",
    properties: {
      deliveryId: { type: "integer", errorMessage: "must be of integer type" },
      status: { type: "string", errorMessage: "must be of string type" },
      date: { type: "date", errorMessage: "must be of date type" },
    },
    required: ["deliveryId", "status"],
    additionalProperties: false,
  };

  constructor(id, deliveryId, status, date) {
    this.id = id;
    this.deliveryId = deliveryId;
    this.status = status;
    this.date = date;
  }
}

module.exports = Delivery;
