export interface Entry {
  user: string;
  tickest: Ticket[];
}

interface Ticket {
  cost: number;
  name: string;
  quantity: number;
}
