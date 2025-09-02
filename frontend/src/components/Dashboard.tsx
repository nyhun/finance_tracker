import { getSummary } from '../services/api';
import { useEffect, useState } from 'react';
import { Box, Typography, TextField, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import type { SummaryResponse } from '../services/api';

const Dashboard = () => {
    const [month, setMonth] = useState("1"); // string
    const [year, setYear] = useState("2025");
    const [summary, setSummary] = useState<SummaryResponse | null>(null);

    useEffect(() => {
        getSummary(month, year).then((res) => {
            setSummary(res);
        });
    }, [month, year]);

    const monthOptions = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const yearOptions = ["2024", "2025", "2026", "2027", "2028", "2029", "2030"];

    return (
        <Box border={1} borderColor="divider" borderRadius={2} padding={2}>
            <Box mt={2} mb={4} display="flex" justifyContent="space-between" width="300px" p={2}>
                <TextField
                    select
                    label="Month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    sx={{ width: '48%' }}
                >
                    {monthOptions.map((option, idx) => (
                        <MenuItem key={option} value={(idx + 1).toString()}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    sx={{ width: '48%' }}
                >
                    {yearOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
            {summary && summary.transactions.length > 0 && (
                <>
                    <Box mb={2}>
                        <Typography variant="body1">Income: ${summary?.totalIncome.toFixed(2)}</Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="body1">Expenses: ${summary?.totalExpenses.toFixed(2)}</Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="body1">Balance: ${summary?.balance.toFixed(2)}</Typography>
                    </Box>
                    <Box mb={2}>
                        <Typography variant="body1">Category Breakdown:</Typography>
                    </Box>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Category</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.entries(summary?.categoryBreakdown || {}).map(([category, amount]) => (
                                <TableRow key={category}>
                                    <TableCell>{category}</TableCell>
                                    <TableCell>${amount.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                </>
            )}
            {summary && summary.transactions.length <= 0 && (
                <Typography variant="h5">No transactions found</Typography>
            )}
        </Box>
    );
};

export default Dashboard;
