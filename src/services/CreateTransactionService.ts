import {getCustomRepository, getRepository} from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';
import Category from '../models/Category';

interface TransactionDTO{
  title: string;

  value: number;

  type: 'income' | 'outcome';

  category: string;
}

class CreateTransactionService {

  public async execute({title, value, type, category}:TransactionDTO): Promise<Transaction> {
    
    const transactionsRepository = getCustomRepository(TransactionsRepository)

    if(type !== 'income' && type !== 'outcome'){
      throw new AppError('Tipo da transação inválido');
    }

    if(type == 'outcome'){
      const currentBalance = await transactionsRepository.getBalance();

      if(value > currentBalance.total){
        throw new AppError("Saída de caixa maior que o caixa atual");
      }
    }
    
    
    const categoryRepository = getRepository(Category);
    
    let category_id = "";
    
    const categoryExists = await categoryRepository.findOne({
      title: category
    })

    if(categoryExists){

      category_id = categoryExists.id;

    }else{
      const newCategory = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const transaction = transactionsRepository.create({title, value, type, category_id});
    
    await transactionsRepository.save(transaction);
    
    return transaction;
    
  }
}

export default CreateTransactionService;
