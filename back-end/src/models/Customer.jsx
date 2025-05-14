import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

/*
  O cliente deve ser maior de 18 anos.
  Por isso, para validar a data de nascimento, calculamos a data
  máxima que o cliente pode ter nascido (no passado) para ter
  pelo menos 18 anos na data atual
*/
const maxDateOfBirth = new Date()  // Hoje
maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - 18)

// O cliente pode ter nascido, no máximo, há 120 anos
const minDateOfBirth = new Date()
minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - 120)

const Customer = z.object({
  name: z.string()
    .trim()   // Retira espaços em branco do início e do fim
    .min(5, { message: 'O nome deve ter, no mínimo, 5 caracteres.'})
    .max(100, { message: 'O nome pode ter, no máximo, 100 caracteres.'})
    .includes(' ', { message: 'O nome deve ter um espaço em branco separando nome e sobrenome.'})
  
})
export default Customer