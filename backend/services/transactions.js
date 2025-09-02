const dayjs = require('dayjs');
const {
  insertTransaction,
  updateTransactionById,
  deleteTransactionById,
  getTransactionsInDateRange,
  getTransactionsWithFilters
} = require('../db/db');

function createTransaction(data) {
  const id = insertTransaction(data);
  return { id };
}

function updateTransaction(id, data) {
  return updateTransactionById(id, data);
}

function deleteTransaction(id) {
  return deleteTransactionById(id);
}

function getMonthlySummary({ month, year, category }) {
  const startDate = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD');
  const endDate = dayjs(startDate).endOf('month').format('YYYY-MM-DD');

  const transactions = getTransactionsInDateRange({
    startDate,
    endDate,
    category,
  });

  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryBreakdown: {},
    transactions,
  };

  for (const t of transactions) {
    const amt = t.amount;
    if (t.type === 'income') summary.totalIncome += amt;
    else summary.totalExpenses += amt;

    summary.categoryBreakdown[t.category] ??= 0;
    summary.categoryBreakdown[t.category] += amt;
  }

  summary.balance = summary.totalIncome - summary.totalExpenses;
  return summary;
}

function getTransactions(filters) {
  return getTransactionsWithFilters(filters);
}

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlySummary,
  getTransactions,
};
