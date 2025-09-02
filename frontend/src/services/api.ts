import axios from 'axios';
import type { Transaction } from '../types/transaction.ts';

const API_URL = '/api/transactions';

export interface SummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  categoryBreakdown: Record<string, number>;
  transactions: Transaction[];
}

export const fetchTransactions = async (params = {}) =>
  (await axios.get<Transaction[]>(API_URL, { params })).data;

export const createTransaction = async (transaction: Transaction) =>
  (await axios.post<Transaction>(API_URL, transaction)).data;

export const updateTransaction = async (id: number, transaction: Transaction) =>
  (await axios.put<Transaction>(`${API_URL}/${id}`, transaction)).data;

export const deleteTransaction = async (id: number) =>
  (await axios.delete<{ success: boolean }>(`${API_URL}/${id}`)).data;

export const getSummary = async (month: string, year: string): Promise<SummaryResponse> =>
  (await axios.get<SummaryResponse>(`${API_URL}/summary`, { params: { month, year } })).data;
