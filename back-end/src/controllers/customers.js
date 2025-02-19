import prisma from '../database/client.js'

const controller = {}     // Objeto vazio

controller.create = async function(req, res) {
    try {
        //Dentro do parâmetro req (requisição), haverá
        //um objeto chamado 'body' que contém as informações 
        //que queremos armazenar do BD. Então, invocamos o prisma
        //para fazer a interface com o BD, repassando o req.body
        await prisma.customer.create({ data: req.body })
  
      // se der tudo certo, enviamos como resposta o código 
      // HTTP apropriado, no caso HTTP 201: created
      res.status(201).end()
    }
    catch(error) {
        //se algo de errado acontecer, caíremos aqui
        //nesse caso, vamos exibir o erro no console e enviar 
        // o código HTTP correspondente a erro do servidor 
        // HTTP 500: internal server error
      console.error(error)
      res.status(500).end()
    }
  }

export default controller