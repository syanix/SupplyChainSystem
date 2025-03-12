export interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  receivedDate: Date;
  notes?: string;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  items?: GoodsReceiptItem[];
}

export interface GoodsReceiptItem {
  id: string;
  quantityReceived: number;
  notes?: string;
  goodsReceiptId: string;
  orderItemId: string;
  createdAt: Date;
  updatedAt: Date;
}
