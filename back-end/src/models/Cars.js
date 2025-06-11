import { z } from 'zod'

// Lista de cores conforme front-end
const colors = [
    'AMARELO', 'AZUL', 'BRANCO', 'CINZA', 'DOURADO', 'LARANJA', 'MARROM',
    'PRATA', 'PRETO', 'ROSA', 'ROXO', 'VERDE', 'VERMELHO'
]

const currentYear = new Date().getFullYear()
const minYear = 1960

const minSellingDate = new Date('2020-01-01')
const maxSellingDate = new Date() // hoje

const Car = z.object({
    brand: z.string()
        .min(1, { message: 'Marca deve ter pelo menos 1 caractere.' })
        .max(25, { message: 'Marca pode ter no máximo 25 caracteres.' }),

    model: z.string()
        .min(1, { message: 'Modelo deve ter pelo menos 1 caractere.' })
        .max(25, { message: 'Modelo pode ter no máximo 25 caracteres.' }),

    color: z.enum(colors, { message: 'Cor inválida.' }),

    year_manufacture: z.number()
        .int({ message: 'Ano de fabricação deve ser um número inteiro.' })
        .min(minYear, { message: `Ano de fabricação não pode ser anterior a ${minYear}.` })
        .max(currentYear, { message: `Ano de fabricação não pode ser maior que ${currentYear}.` }),

    imported: z.boolean(),

    plates: z.string()
        .length(8, { message: 'Placa deve ter exatamente 8 caracteres.' }),

    selling_date: z.preprocess((arg) => {
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg)
    }, z.date()
        .min(minSellingDate, { message: `Data de venda não pode ser anterior a 01/01/2020.` })
        .max(maxSellingDate, { message: 'Data de venda não pode ser no futuro.' })
        .optional()
        .nullable()
    ),

    selling_price: z.number()
        .min(1000, { message: 'Preço de venda deve ser no mínimo R$ 1.000,00.' })
        .max(5000000, { message: 'Preço de venda deve ser no máximo R$ 5.000.000,00.' })
        .optional()
})

export default Car
