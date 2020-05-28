import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions: Transaction[] = [];
    const outcomeTransactions: Transaction[] = [];

    const transactions = await this.find();

    transactions.map(transaction => {
      if (transaction.type === 'income') {
        incomeTransactions.push(transaction);
        return transaction;
      }
      outcomeTransactions.push(transaction);
      return transaction;
    });

    const income = incomeTransactions.reduce((pV, cV) => pV + cV.value, 0);
    const outcome = outcomeTransactions.reduce((pV, cV) => pV + cV.value, 0);
    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
