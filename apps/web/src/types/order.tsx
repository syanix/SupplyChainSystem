export var OrderStatus;
(function (OrderStatus) {
  OrderStatus['DRAFT'] = 'draft';
  OrderStatus['PENDING'] = 'pending';
  OrderStatus['CONFIRMED'] = 'confirmed';
  OrderStatus['SHIPPED'] = 'shipped';
  OrderStatus['DELIVERED'] = 'delivered';
  OrderStatus['CANCELLED'] = 'cancelled';
})(OrderStatus || (OrderStatus = {}));
