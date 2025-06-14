import prisma from '../database/client.js'
import { ZodError } from 'zod'
import Car from '../models/Cars.js'

const controller = {}  

controller.create = async function (req, res) {
 try {
    const validatedData = Car.parse(req.body)

  const result = await prisma.car.create({ data: validatedData })

  res.status(201).send(result)
 }
 catch(error) {
    if(error instanceof ZodError) {
      res.status(400).send(error.issues)
    }
    else {
    console.error(error)
    res.status(500).end()
    }
 }
}

controller.retrieveAll = async function (req, res) {
 try {
  const result = await prisma.car.findMany({
   orderBy: [ { model: 'asc' } ]
  })
  res.send(result)
 }
 catch(error) {
  console.error(error)
  res.status(500).end()
 }
}

controller.retrieveOne = async function (req, res) {
 try {
  const result = await prisma.car.findUnique({
   where: { id: Number(req.params.id) }
  })
  if(result) res.send(result)
  else res.status(404).end()
 }
 catch(error) {
  console.error(error)
  res.status(500).end()
 }
}

controller.update = async function(req, res) {
 try {
    const validatedData = Car.parse(req.body)

  const result = await prisma.car.update({
   where: { id: Number(req.params.id) },
   data: validatedData
  })

  if(result) res.status(200).send(result)
    else res.status(404).end()
 }
 catch(error) {
    if(error instanceof ZodError) {
      res.status(400).send(error.issues)
    }
    else {
    console.error(error)
    if(error?.code === 'P2025') res.status(404).end()
    else res.status(500).end()
    }
 }
}

controller.delete = async function(req, res) {
 try {
  await prisma.car.delete({
   where: { id: Number(req.params.id) }
  })
  res.status(204).end()
 }
 catch(error) {
  console.error(error)
  if(error?.code === 'P2025') res.status(404).end()
  else res.status(500).end()
 }
}

export default controller