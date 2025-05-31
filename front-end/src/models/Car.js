import { z } from 'zod'

const maxSellingDate = new Date(); // Hoje
const minManufactureDate = new Date(1960, 0, 1); // Define a data mínima para 1 de janeiro de 1960

const maxYearManufacture = new Date();
maxYearManufacture.setFullYear(maxYearManufacture.getFullYear());

// Extrair apenas o ano de minManufactureDate e maxYearManufacture para comparação com year_manufacture
const minYear = minManufactureDate.getFullYear();
const maxYear = maxYearManufacture.getFullYear();

// Para selling_date
const storeOpen = new Date(2020, 0, 1); // Data de abertura da loja (01/01/2020)

// Lista de cores válidas extraídas do CarsForm.jsx
const validColors = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 
  'LARANJA', 'MARROM', 'PRATA', 'PRETO', 'ROSA', 
  'ROXO', 'VERDE', 'VERMELHO'
]

const Car = z.object({
  brand: z.string()
    .trim()  // Remove espaços em branco do início e do fim
    .min(1, { message: 'A marca deve ter no mínimo 1 caractere.' })
    .max(25, { message: 'A marca pode ter no máximo 25 caracteres.' }),
  
  model: z.string()
    .trim() 
    .min(1, { message: 'O modelo deve ter no mínimo 1 caractere.' })
    .max(25, { message: 'O modelo pode ter no máximo 25 caracteres.' }),
  
  color: z.enum(validColors, { 
    message: 'Cor inválida ou não informada.' 
  }),
  
  year_manufacture: z.coerce.number()
    .int({ message: 'O ano de fabricação deve ser um número inteiro.' })
    .min(minYear, { message: 'O ano de fabricação deve ser a partir de 1960.' })
    .max(maxYear, { message: `O ano de fabricação não pode ser maior que o ano atual (${maxYear}).` }),
  
  imported: z.boolean({
    message: 'O campo importado deve verdadeiro ou falso.'
  }),
  
  plates: z.string()
    .transform(val => val.replace('_', ''))
    // Depois de um transform(), o Zod não permite usar length().
    // Então usamos uma função personalizada com refine() para validar o
    // comprimento do valor
    .transform(val => val.trim())
    .refine(val => val.length === 8, {
      message: 'O número da placa deve ter 8 posições.'
  }),
  
  selling_date: z.coerce.date()
    .min(storeOpen, {
      message: 'A data de venda não pode ser anterior à data de abertura da loja (01/01/2020).'
    })
    .max(maxSellingDate, {
      message: 'A data de venda não pode ser posterior à data atual.'
    })
    .nullish(), 
  
  selling_price: z.coerce.number()
    .gte(1000, { message: 'O preço de venda deve ser, no mínimo R$ 1.000,00.' })
    .lte(5000000, { message: 'O preço de venda deve ser, no máximo R$ 5.000.000,00.' })
    .nullish() 
})

export default Car