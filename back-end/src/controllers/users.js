import prisma from '../database/client.js'
import bcrypt from 'bcrypt'

const controller = {}   // Objeto vazio

controller.create = async function (req, res) {
  try {
    //Se existe o campo 'password' em req.body,
    //é necessário gerar o hash da senha antes.
    //de armazená-lo no BD.

    if (req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }

    // Dentro do parâmetro req (requisição), haverá
    // um objeto chamado "body" que contém as informações
    // que queremos armazenar do BD. Então, invocamos o
    // Prisma para fazer a interface com o BD, repassando
    // o req.body  user
    await prisma.user.create({ data: req.body })

    // Se der tudo certo, enviamos como resposta o 
    // código HTTP apropriado, no caso
    // HTTP 201: Created
    res.status(201).end()
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    // Nesse caso, vamos exibir o erro no console e enviar
    // o código HTTP correspondente a erro do servidor
    // HTTP 500: Internal Server Error
    console.error(error)
    res.status(500).end()
  }
}

controller.retrieveAll = async function (req, res) {
  try {
    const result = await prisma.user.findMany({
      orderBy: [
        { fullname: 'asc' }  // ✅ Corrigido aqui!
      ]
    })

    res.status(200).json(result)
  }
  catch(error) {
    console.error('Erro ao listar carros:', error)
    res.status(500).json({ error: error.message || 'Erro interno do servidor' })
  }
}

controller.retrieveOne = async function (req, res) {
  try {
    // Busca no banco de dados apenas o carroindicado
    // pelo parâmetro "id"
    const result = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    })

    // Encontrou ~> HTTP 200: OK (implícito)
    if(result) res.send(result)

    // Não encontrou ~> HTTP 404: Not found
    else res.status(404).end()
  }
  catch(error) {
    // Se algo de errado acontecer, cairemos aqui
    // Nesse caso, vamos exibir o erro no console e enviar
    // o código HTTP correspondente a erro do servidor
    // HTTP 500: Internal Server Error
    console.error(error)
    res.status(500).end()
  }
}

controller.update = async function(req, res) {
  try {

 //Se existe o campo 'password' em req.body,
    //é necessário gerar o hash da senha antes.
    //de armazená-lo no BD.

    if (req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 12)
    }


    // Busca o registro no banco de dados pelo seu id
    // e atualiza as informações com o conteúdo de req.body
    await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })

    // Encontrou e atualizou ~> HTTP 204: No content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    
    // Não encontrou e não atualizou ~> HTTP 404: Not found
    if(error?.code === 'P2025') res.status(404).end()
    // Outros tipos de erro ~> HTTP 500: Internal server error
    else res.status(500).end()
  }
}

controller.delete = async function(req, res) {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    })

    // Encontrou e excluiu ~> HTTP 204: No content
    res.status(204).end()
  }
  catch(error) {
    console.error(error)
    
    // Não encontrou e não excluiu ~> HTTP 404: Not found
    if(error?.code === 'P2025') res.status(404).end()
    // Outros tipos de erro ~> HTTP 500: Internal server error
    else res.status(500).end()
  }
}

export default controller
