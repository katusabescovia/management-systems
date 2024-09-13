const Expense = require('../models/expenseModel');

// Helper functions to summarize expenses
const summarizeByDay = (expenses) => {
    const summary = {};
    expenses.forEach(expense => {
        const date = expense.date.toISOString().split('T')[0];
        if (!summary[date]) {
            summary[date] = { total: 0, details: [] };
        }
        summary[date].total += expense.amount;
        summary[date].details.push(expense);
    });
    return summary;
};

const summarizeByWeek = (expenses) => {
    const summary = {};
    expenses.forEach(expense => {
        const date = new Date(expense.date);
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // Get start of week (Sunday)
        const endOfWeek = new Date(date);
        endOfWeek.setDate(date.getDate() + (6 - date.getDay())); // Get end of week (Saturday)

        const weekKey = `${startOfWeek.toISOString().split('T')[0]} to ${endOfWeek.toISOString().split('T')[0]}`;
        
        if (!summary[weekKey]) {
            summary[weekKey] = { total: 0, details: [] };
        }
        summary[weekKey].total += expense.amount;
        summary[weekKey].details.push(expense);
    });
    return summary;
};

const summarizeByMonth = (expenses) => {
    const summary = {};
    expenses.forEach(expense => {
        const monthKey = `${expense.date.getFullYear()}-${('0' + (expense.date.getMonth() + 1)).slice(-2)}`;
        if (!summary[monthKey]) {
            summary[monthKey] = { total: 0, details: [] };
        }
        summary[monthKey].total += expense.amount;
        summary[monthKey].details.push(expense);
    });
    return summary;
};

const summarizeByYear = (expenses) => {
    const summary = {};
    expenses.forEach(expense => {
        const yearKey = `${expense.date.getFullYear()}`;
        if (!summary[yearKey]) {
            summary[yearKey] = { total: 0, details: [] };
        }
        summary[yearKey].total += expense.amount;
        summary[yearKey].details.push(expense);
    });
    return summary;
};

exports.generateReport = async (req, res) => {
    const { period, category, startDate, endDate } = req.query;

    try {
        let filter = {};
        if (category) filter.category = category;
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (startDate) {
            filter.date = { $gte: new Date(startDate) };
        } else if (endDate) {
            filter.date = { $lte: new Date(endDate) };
        }

        console.log('Filter:', filter);

        const expenses = await Expense.find(filter);

        console.log('Expenses:', expenses);

        const summary = {
            daily: summarizeByDay(expenses),
            weekly: summarizeByWeek(expenses),
            monthly: summarizeByMonth(expenses),
            yearly: summarizeByYear(expenses)
        };

        console.log('Summary:', summary);

        res.json(summary);
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: 'Failed to generate report' });
    }
};
