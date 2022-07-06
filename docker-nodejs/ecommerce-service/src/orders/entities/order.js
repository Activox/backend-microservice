// Entidad libro.

class Order {
  static schema = {
    type: "object",
    properties: {
      storeId: { type: "integer", errorMessage: "must be of integer type" },
      userId: { type: "integer", errorMessage: "must be of integer type" },
      status: { type: "string", errorMessage: "must be of string type" },
    },
    required: ["storeId", "userId"],
    additionalProperties: false,
  };

  constructor(id, storeId, userId, status) {
    this.id = id;
    this.storeId = storeId;
    this.userId = userId;
    this.status = status;
  }
}

module.exports = Order;
