// tests/transactions.test.js
const dayjs = require('dayjs');

// Mock DB functions
const mockInsertTransaction = jest.fn();
const mockUpdateTransactionById = jest.fn();
const mockDeleteTransactionById = jest.fn();
const mockGetTransactionsInDateRange = jest.fn();
const mockGetTransactionsWithFilters = jest.fn();

// Replace the actual db module with mocks
jest.mock('../../db/db', () => ({
  insertTransaction: (...args) => mockInsertTransaction(...args),
  updateTransactionById: (...args) => mockUpdateTransactionById(...args),
  deleteTransactionById: (...args) => mockDeleteTransactionById(...args),
  getTransactionsInDateRange: (...args) => mockGetTransactionsInDateRange(...args),
  getTransactionsWithFilters: (...args) => mockGetTransactionsWithFilters(...args),
}));

const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
  getTransactions,
} = require('../../services/transactions');

describe('transactions service', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should call insertTransaction and return id', () => {
      mockInsertTransaction.mockReturnValue(42);
      const data = { type: 'income', amount: 100, category: 'salary', date: '2025-09-01' };
      
      const result = createTransaction(data);
      
      expect(mockInsertTransaction).toHaveBeenCalledWith(data);
      expect(result).toEqual({ id: 42 });
    });
  });

  describe('updateTransaction', () => {
    it('should call updateTransactionById and return result', () => {
      mockUpdateTransactionById.mockReturnValue(true);
      const id = 10;
      const data = { amount: 200 };
      
      const result = updateTransaction(id, data);
      
      expect(mockUpdateTransactionById).toHaveBeenCalledWith(id, data);
      expect(result).toBe(true);
    });
  });

  describe('deleteTransaction', () => {
    it('should call deleteTransactionById and return result', () => {
      mockDeleteTransactionById.mockReturnValue(true);
      const id = 10;
      
      const result = deleteTransaction(id);
      
      expect(mockDeleteTransactionById).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });

  describe('getMonthlySummary', () => {
    it('should return correct summary for given month/year/category', () => {
      const transactions = [
        { id: 1, type: 'income', amount: 1000, category: 'Salary', date: '2025-09-01' },
        { id: 2, type: 'expense', amount: 200, category: 'Food', date: '2025-09-02' },
        { id: 3, type: 'income', amount: 500, category: 'Freelance', date: '2025-09-10' },
        { id: 4, type: 'expense', amount: 100, category: 'Food', date: '2025-09-15' },
      ];

      mockGetTransactionsInDateRange.mockReturnValue(transactions);

      const summary = getMonthlySummary({ month: '09', year: '2025', category: undefined });

      expect(mockGetTransactionsInDateRange).toHaveBeenCalledWith({
        startDate: '2025-09-01',
        endDate: '2025-09-30',
        category: undefined,
      });

      expect(summary.totalIncome).toBe(1500);
      expect(summary.totalExpenses).toBe(300);
      expect(summary.balance).toBe(1200);
      expect(summary.categoryBreakdown).toEqual({
        Salary: 1000,
        Food: 300,
        Freelance: 500,
      });
      expect(summary.transactions).toEqual(transactions);
    });

    it('should handle empty transactions', () => {
      mockGetTransactionsInDateRange.mockReturnValue([]);

      const summary = getMonthlySummary({ month: '09', year: '2025' });

      expect(summary.totalIncome).toBe(0);
      expect(summary.totalExpenses).toBe(0);
      expect(summary.balance).toBe(0);
      expect(summary.categoryBreakdown).toEqual({});
      expect(summary.transactions).toEqual([]);
    });
  });

  describe('getTransactions', () => {
    it('should call getTransactionsWithFilters and return result', () => {
      const filters = { category: 'Food', from: '2025-01-01', to: '2025-12-31' };
      const expectedResult = [{ id: 1, type: 'expense', amount: 50, category: 'Food', date: '2025-03-03' }];
      
      mockGetTransactionsWithFilters.mockReturnValue(expectedResult);

      const result = getTransactions(filters);

      expect(mockGetTransactionsWithFilters).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResult);
    });
  });

});
