export interface PaymentEntity {
  createdAt: number;
  id: string;
  items: Item[];
  provider: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  user: string;
}

interface Item {
  title: string;
  quantity: number;
  unit_price: number;
}
