// src/models/Order.js
let orders = [];

class Order {
  constructor(order_id, user_id, item_id, quantity) {
    this.order_id = order_id;
    this.user_id = user_id;
    this.item_id = item_id;
    this.quantity = quantity;
  }

  static create(order) {
    orders.push(order);
    return order;
  }

  static findAll() {
    return orders;
  }
}

module.exports = Order;
