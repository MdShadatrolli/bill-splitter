export interface BillItem {
  id: string;
  name: string;
  price: number;
}

export interface SplitBill {
  total: number;
  perPerson: number;
  items: BillItem[];
}