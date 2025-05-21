import { z } from 'zod'

// Define a data máxima para venda como a data atual
const maxSellingDate = new Date(); // Hoje
// Estabelece a data mínima de fabricação como 1° de janeiro de 1960
const minManufactureDate = new Date(1960, 0, 1); 

// Configura o ano máximo de fabricação como o ano atual
const maxYearManufacture = new Date();
maxYearManufacture.setFullYear(maxYearManufacture.getFullYear());

// Obtém apenas os anos de fabricação mínimo e máximo para validação
const minYear = minManufactureDate.getFullYear();
const maxYear = maxYearManufacture.getFullYear();

// Define a data de abertura da loja para validação de vendas
const storeOpen = new Date(2020, 0, 1); 

// Cores permitidas para veículos, conforme definido no CarsForm.jsx
const validColors = [
  'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 
  'LARANJA', 'MARROM', 'PRATA', 'PRETO', 'ROSA', 
  'ROXO', 'VERDE', 'VERMELHO'
]


const Car = z.object({
  brand: z.string()
    .trim()  // Remove espaços em branco no início e fim
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
    message: 'O campo importado deve ser um valor booleano (verdadeiro ou falso).'
  }),
  
  plates: z.string()
    .trim() 
    .length(8, { message: 'A placa deve ter exatamente 8 caracteres.' }),
  
  selling_date: z.coerce.date()
    .min(storeOpen, {
      message: 'A data de venda não pode ser anterior à data de abertura da loja (01/01/2020).'
    })
    .max(maxSellingDate, {
      message: 'A data de venda não pode ser posterior à data atual.'
    })
    .nullish(), // Permite valores nulos ou undefined
  
  selling_price: z.coerce.number()
    .gte(1000, { message: 'O preço de venda deve ser de no mínimo R$ 1.000,00.' })
    .lte(5000000, { message: 'O preço de venda deve ser de no máximo R$ 5.000.000,00.' })
    .nullish() // Campo não obrigatório
})


export default Car