// Entidad libro.

class OrderDetail {

  static schema = {
    type: "object",
      properties: {
        orderId :{type: "integer",errorMessage:'must be of integer type'},
        productId : {type: "integer",errorMessage:'must be of integer type'},
        quantity : {type: "integer",errorMessage:'must be of integer type'},
      },
      required: ["orderId", "productId", "quantity"],
      additionalProperties: false,
  }

  constructor(id, orderId, productId, quantity) {
    this.id = id;
    this.orderId = orderId;
    this.productId = productId;
    this.quantity = quantity;
  }

}

module.exports = OrderDetail;