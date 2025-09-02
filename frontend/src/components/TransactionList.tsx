import { useEffect, useState } from 'react';
import type { Transaction } from '../types/transaction';
import {
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '../services/api';
import {
  IconButton, List, ListItem, ListItemText, ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const load = () => {
    fetchTransactions().then(setTransactions);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await deleteTransaction(id);
    load();
  };

  const handleEdit = async (tx: Transaction) => {
    if (!tx.id) return;
    await updateTransaction(tx.id, tx);
    setEditing(null);
    load();
  };

  return (
    <>
      {editing && <TransactionForm initialData={editing} />}
      <List>
        {transactions.map((tx) => (
          <ListItem key={tx.id}>
            <ListItemText
              primary={`${tx.type.toUpperCase()} - $${tx.amount}`}
              secondary={`${tx.category} - ${tx.date}`}
            />
            <ListItemSecondaryAction>
              <IconButton onClick={() => setEditing(tx)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(tx.id)}><DeleteIcon /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TransactionList;
