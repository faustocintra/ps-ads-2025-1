import { z } from 'zod'

const allowedColors = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 
  'LARANJA', 'MARROM', 'PRATA', 'PRETO', 'ROSA', 
  'ROXO', 'VERDE', 'VERMELHO'
]

const Car = z.object({
  brand: z.string()
    .min(1, { message: 'A marca deve ter no mínimo 1 caractere' })
    .max(25, { message: 'A marca deve ter no máximo 25 caracteres' }),
  
  model: z.string()
    .min(1, { message: 'O modelo deve ter no mínimo 1 caractere' })
    .max(25, { message: 'O modelo deve ter no máximo 25 caracteres' }),

  color: z.enum(allowedColors, {
    errorMap: () => ({ message: 'Por favor, selecione uma cor da lista' })
  }),

  year_manufacture: z.number()
    .int()
    .gte(1960, { message: 'O ano de fabricação deve ser de 1960 em diante' })
    .lte(new Date().getFullYear(), { message: 'O ano de fabricação não pode ser futuro' }),

  imported: z.boolean(),

  plates: z.string()
    .length(8, { message: 'A placa deve ter exatamente 8 caracteres' }),

  selling_date: z.coerce.date({
    invalid_type_error: "Forneça uma data válida."
  })
    .min(new Date('2020-01-01'), { message: 'A data de venda deve ser a partir de 01/01/2020' })
    .max(new Date(), { message: 'A data de venda não pode ser futura' })
    .nullable() // <--- ADICIONADO: Permite que o valor seja nulo
    .optional(),

  selling_price: z.preprocess(
    // Se o valor for uma string vazia ou nulo, converte para undefined.
    (val) => (val === '' || val === null ? undefined : val),

    // Agora, o validador de número só roda se o valor não for undefined.
    z.coerce.number({ invalid_type_error: 'O preço deve ser um número.' })
      .gte(1000, { message: 'O preço de venda deve ser no mínimo R$ 1.000,00' })
      .lte(5000000, { message: 'O preço de venda deve ser no máximo R$ 5.000.000,00' })
      .optional()
  ),
})

export default Car