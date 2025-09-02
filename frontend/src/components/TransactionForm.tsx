import React, { useState, useEffect } from 'react';
import {
  Button, TextField, MenuItem, Box, Stack,
} from '@mui/material';
import type { Transaction } from '../types/transaction';

interface Props {
  initialData?: Transaction;
}

const TransactionForm: React.FC<Props> = ({ initialData }) => {
  const [form, setForm] = useState<Transaction>(
    initialData || { type: 'expense', amount: 0, category: '', date: '' }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Box>
      <Stack spacing={2}>
        <TextField
          select
          label="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
        <TextField
          label="Amount"
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
        />
        <TextField
          label="Category"
          name="category"
          value={form.category}
          onChange={handleChange}
        />
        <TextField
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={() => onSubmit(form)}>
          {initialData ? 'Update' : 'Add'} Transaction
        </Button>
      </Stack>
    </Box>
  );
};

export default TransactionForm;
