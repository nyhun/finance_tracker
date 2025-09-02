import { useEffect, useState } from 'react';
import type { Transaction } from '../types/transaction';
import {
  deleteTransaction,
  fetchTransactions,
  updateTransaction,
} from '../services/api';
import {
  Box, IconButton, List, ListItem, ListItemText, Stack, Pagination, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TransactionForm from './TransactionForm';

const ITEMS_PER_PAGE = 10;

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const load = (newPage = page) => {
    setLoading(true);
    fetchTransactions({ 
      offset: (newPage - 1) * ITEMS_PER_PAGE, 
      limit: ITEMS_PER_PAGE 
    }).then(({ transactions, total }) => {
      setTransactions(transactions);
      setTotal(total);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    load(value);
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

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
      {editing && <TransactionForm initialData={editing} onSubmit={handleEdit} />}
      <List sx={{ minHeight: 400 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : transactions.length === 0 ? (
          <Typography>No transactions found</Typography>
        ) : (
          transactions.map((tx) => (
            <ListItem key={tx.id}>
              <ListItemText
                primary={`${tx.type.toUpperCase()} - $${tx.amount}`}
                secondary={`${tx.category} - ${tx.date}`}
              />
              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => setEditing(tx)}><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(tx.id)}><DeleteIcon /></IconButton>
              </Stack>
            </ListItem>
          ))
        )}
      </List>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2} mb={4}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
            showFirstButton 
            showLastButton
          />
        </Box>
      )}
    </>
  );
};

export default TransactionList;
