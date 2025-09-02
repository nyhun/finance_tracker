const request = require('supertest');
const app = require('../../app');
const { db } = require('../../db/db');

beforeAll(() => {
    // TODO: this wipes db -- use a test db file instead
    db.prepare(`DELETE FROM transactions`).run();
});

afterAll(() => {
    db.prepare(`DELETE FROM transactions`).run();
    db.close();
});

describe('Transactions API', () => {
    let createdId;

    it('should get an empty list of transactions', async () => {
        const res = await request(app)
            .get('/api/transactions');

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('transactions');
        expect(res.body.transactions).toEqual([]);
        expect(res.body).toHaveProperty('total');
        expect(res.body.total).toBe(0);
    });

    it('should create a new income transaction', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .send({
                type: 'income',
                amount: 1000,
                category: 'Freelance',
                date: '2025-09-01'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        createdId = res.body.id;
    });

    it('should get a monthly summary', async () => {
        const res = await request(app)
            .get('/api/transactions/summary')
            .query({ month: '09', year: '2025' });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('totalIncome');
        expect(res.body).toHaveProperty('totalExpenses');
        expect(res.body).toHaveProperty('balance');
        expect(res.body).toHaveProperty('categoryBreakdown');
        expect(res.body.categoryBreakdown).toHaveProperty('Freelance');
        expect(res.body.categoryBreakdown.Freelance).toBe(1000);
        expect(res.body.totalIncome).toBe(1000);
        expect(res.body.totalExpenses).toBe(0);
        expect(res.body.balance).toBe(1000);
        expect(Array.isArray(res.body.transactions)).toBe(true);
        expect(res.body.transactions.length).toBe(1);
        expect(res.body.transactions[0].id).toBe(createdId);
    });

    it('should update the created transaction', async () => {
        const res = await request(app)
            .put(`/api/transactions/${createdId}`)
            .send({
                type: 'income',
                amount: 2000,
                category: 'Consulting',
                date: '2025-09-02'
            });

        expect(res.statusCode).toBe(200);
        // expect the updated object in response
        expect(res.body).toHaveProperty('id', createdId);
        expect(res.body).toHaveProperty('amount', 2000);
        expect(res.body).toHaveProperty('category', 'Consulting');
        expect(res.body).toHaveProperty('date', '2025-09-02');
    });

    it('should delete the created transaction', async () => {
        const res = await request(app)
            .delete(`/api/transactions/${createdId}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ success: true });
    });
});