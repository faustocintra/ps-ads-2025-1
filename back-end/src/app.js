// carregando as variáveis de ambiente do arquivo .env
import dotenv from 'dotenv'
dotenv.config()

import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import indexRouter from './routes/index.js'


const app = express()

//configurando CORS para aceitar requisições a partir dos servidores
// configurados na variável ambiente  ALLOWED_ORIGINS
import cors from 'cors'
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    //credentials: true
}))

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)

//------------------- ROTAS ---------------------------

import customersRouter from './routes/customers.js'
app.use('/customers', customersRouter)

import carsRouter from './routes/cars.js'
app.use('/cars', carsRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)

export default app