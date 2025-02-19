import prisma from '../database/client.js'

const controller = {} //objto vazio

controller.create = async function (req, res){
    try {
        //dentro do parametro req, haverá um obj
        //chamado 'body' que contem infos que queremos
        //armazenar do BD. Então, invocamos o Prisma
        //para fazer a interface com o BD, repassando
        //o req.body
        await prisma.customer.create({data: req.body})

        //se der tudo certo, enviamos como resposta o
        //cód HTTP apropriado, no caso: HTTP 201: Created
        res.status(201).end()
    }
    catch(error){
        //se algo de errado acontecer, cairemos aqui
        //nesse caso, vamos exibir o erro no console 
        //e enviar o cód HTTP correspondente ao erro do
        //servidor HTTP 500: Internal Server Erro
        console.error(error)
        res.status(500).end()
    }
}
export default controller