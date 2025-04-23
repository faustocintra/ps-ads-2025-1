import prisma from '../database/client.js';

const controller = {};

// Criar novo vendedor
controller.criar = async function (req, res) {
  try {
    await prisma.seller.create({ data: req.body });
    res.status(201).end(); // Created
  } catch (error) {
    console.error(error);
    res.status(500).end(); // Internal Server Error
  }
};

// Listar todos os vendedores
controller.listar = async function (req, res) {
  try {
    const result = await prisma.seller.findMany({
      orderBy: [{ fullname: 'asc' }]
    });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Buscar um vendedor por ID
controller.recuperarUm = async function (req, res) {
  try {
    const result = await prisma.seller.findUnique({
      where: { id: Number(req.params.id) }
    });
    if (result) res.send(result);
    else res.status(404).end(); // Not Found
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
};

// Atualizar vendedor por ID
controller.atualizar = async function (req, res) {
  try {
    await prisma.seller.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    res.status(204).end(); // No Content
  } catch (error) {
    console.error(error);
    if (error?.code === 'P2025') res.status(404).end();
    else res.status(500).end();
  }
};

// Excluir vendedor por ID
controller.excluir = async function (req, res) {
  try {
    await prisma.seller.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).end(); // No Content
  } catch (error) {
    console.error(error);
    if (error?.code === 'P2025') res.status(404).end();
    else res.status(500).end();
  }
};

export default controller;
