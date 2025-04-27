import prisma from '../database/client.js'

const controller = {}

controller.retrieveAll = async (req, res) => {
  try {
    const sellers = await prisma.seller.findMany({
      orderBy: { fullname: 'asc' }
    })
    res.json(sellers)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

controller.retrieveOne = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const seller = await prisma.seller.findUnique({ where: { id } })
    if (!seller) return res.sendStatus(404)
    res.json(seller)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

controller.create = async (req, res) => {
  try {
    await prisma.seller.create({ data: req.body })
    res.sendStatus(201)
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
}

controller.update = async (req, res) => {
  const id = Number(req.params.id)
  try {
    await prisma.seller.update({
      where: { id },
      data: req.body
    })
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    if (err?.code === 'P2025') res.sendStatus(404)
    else res.sendStatus(500)
  }
}

controller.delete = async (req, res) => {
  const id = Number(req.params.id)
  try {
    await prisma.seller.delete({ where: { id } })
    res.sendStatus(204)
  } catch (err) {
    console.error(err)
    if (err?.code === 'P2025') res.sendStatus(404)
    else res.sendStatus(500)
  }
}

export default controller