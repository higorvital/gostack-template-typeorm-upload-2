import {EntityRepository, Repository} from 'typeorm';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction>{
  public async getBalance(): Promise<Balance> {

    const transactions = await this.find();


    const {income, outcome} = transactions.reduce((total, transaction)=>{
      if(transaction.type === 'income'){
        total.income+= Number(transaction.value);
      }else{
        total.outcome+= Number(transaction.value);
      }
      return total
    }, {
      income: 0,
      outcome: 0
    });

    return {
      income,
      outcome,
      total: income - outcome
    }

  }

}

export default TransactionsRepository;
