import 'express-async-errors';
import { Router, Request, Response, NextFunction } from 'express';

import transactionsRouter from './transactions.routes';
import AppError from '../errors/AppError';

const routes = Router();

routes.use('/transactions', transactionsRouter);

routes.use((err: Error, request: Request, response: Response, next: NextFunction)=>{
    if(err instanceof AppError){
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message
        })
    }else{
        return response.status(500).json({
            status: "error",
            message: err.message
        })
    }
})

export default routes;
