export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id?: number;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
}
