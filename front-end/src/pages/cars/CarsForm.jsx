import React from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { ptBR } from 'date-fns/locale/pt-BR'
import { parseISO } from 'date-fns'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import InputMask from 'react-input-mask'
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import { useNavigate, useParams } from 'react-router-dom'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Car from '../../models/Cars'
import fetchAuth from '../../lib/fetchAuth'

export default function CarsForm() {
  const colors = [ { value: 'AMARELO', label: 'AMARELO' }, { value: 'AZUL', label: 'AZUL' }, { value: 'BRANCO', label: 'BRANCO' }, { value: 'CINZA', label: 'CINZA' }, { value: 'DOURADO', label: 'DOURADO' }, { value: 'LARANJA', label: 'LARANJA' }, { value: 'MARROM', label: 'MARROM' }, { value: 'PRATA', label: 'PRATA' }, { value: 'PRETO', label: 'PRETO' }, { value: 'ROSA', label: 'ROSA' }, { value: 'ROXO', label: 'ROXO' }, { value: 'VERDE', label: 'VERDE' }, { value: 'VERMELHO', label: 'VERMELHO' } ];
  const platesMaskFormatChars = { '9': '[0-9]', '$': '[0-9A-J]', 'A': '[A-Z]' };
  const years = [];
  for (let year = new Date().getFullYear(); year >= 1951; year--) years.push(year);

  const formDefaults = { brand: '', model: '', color: '', year_manufacture: '', imported: false, plates: '', selling_price: '', selling_date: null };

  const navigate = useNavigate()
  const params = useParams()

  // 2. INICIALIZAÇÃO DO REACT-HOOK-FORM
  // Ele vai gerenciar todo o estado do formulário e as validações
  const {
    control,          // Para componentes complexos (DatePicker, InputMask)
    register,         // Para registrar os campos normais
    handleSubmit,     // Para gerenciar o evento de submit
    reset,            // Para carregar dados iniciais no formulário
    watch,            // Para observar os valores do formulário (usado no debug)
    formState: {
      errors,         // Objeto com todos os erros de validação
      isDirty         // Equivalente ao "formModified"
    }
  } = useForm({
    resolver: zodResolver(Car), // Integra o Zod com o react-hook-form
    defaultValues: formDefaults // Define os valores iniciais
  })

  React.useEffect(() => {
    if (params.id) loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      // O nome do endpoint no back-end provavelmente é 'cars'
      const response = await fetchAuth.get(`/cars/${params.id}`)
      const result = await response.json()
      
      if(result.selling_date) result.selling_date = parseISO(result.selling_date)
      
      // 3. USA O 'RESET' PARA POPULAR O FORMULÁRIO COM OS DADOS CARREGADOS
      reset(result)

    } catch(error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    } finally {
      feedbackWait(false)
    }
  }

  // 4. FUNÇÃO DE SALVAR é chamada pelo handleSubmit e recebe os dados já validados
  async function saveData(data) {
    feedbackWait(true)
    try {
      if(params.id) {
        // Usa o objeto 'data' que já vem validado e formatado
        await fetchAuth.put(`/cars/${params.id}`, data)
      } else {
        await fetchAuth.post('/cars', data)
      }

      feedbackNotify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true })
      })

    } catch(error) {
      console.log(error)
      // Aqui podemos melhorar a notificação de erro futuramente
      feedbackNotify('ERRO: ' + error.message, 'error')
    } finally {
      feedbackWait(false)
    }
  }

  async function handleBackButtonClick() {
    // Usa o 'isDirty' do react-hook-form para saber se o formulário foi alterado
    if(isDirty && !await feedbackConfirm('Há informações não salvas. Deseja realmente voltar?')) return

    navigate('..', { relative: 'path', 'replace': true })
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        {params.id ? `Editar veículo #${params.id}` : 'Cadastrar novo veículo'}
      </Typography>

      {/* 5. O SUBMIT DO FORMULÁRIO AGORA É GERENCIADO PELO handleSubmit */}
      <Box className="form-fields">
        <form onSubmit={handleSubmit(saveData)}>

          {/* 6. CAMPOS CONECTADOS COM O REACT-HOOK-FORM */}
          <TextField
            variant="outlined" 
            label="Marca do carro"
            fullWidth
            autoFocus
            required
            {...register('brand')}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          />
          <TextField
            variant="outlined" 
            label="Modelo do carro"
            fullWidth
            required
            {...register('model')}
            error={!!errors.model}
            helperText={errors.model?.message}
          />
          <TextField
            select
            variant="outlined" 
            label="Cor"
            fullWidth
            required
            defaultValue="" // Importante para o select
            {...register('color')}
            error={!!errors.color}
            helperText={errors.color?.message}
          > 
            {colors.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
          </TextField>
          <TextField
            select
            variant="outlined" 
            label="Ano de fabricação"
            fullWidth
            required
            defaultValue="" // Importante para o select
            {...register('year_manufacture', { valueAsNumber: true })} // Converte o valor para número
            error={!!errors.year_manufacture}
            helperText={errors.year_manufacture?.message}
          >
            {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
          </TextField>

          <div className="MuiFormControl-root">
            <FormControlLabel
              control={
                <Checkbox {...register('imported')} />
              }
              label='É importado?'
            />
          </div> 
          
          {/* 7. COMPONENTES COMPLEXOS USAM O <Controller> */}
          <Controller
            name="plates"
            control={control}
            render={({ field }) => (
              <InputMask
                mask='AAA-9$99'
                formatChars={platesMaskFormatChars}
                {...field}
              >
                {() => 
                  <TextField
                    variant="outlined" 
                    label="Placa" 
                    fullWidth
                    required
                    error={!!errors.plates}
                    helperText={errors.plates?.message}
                  />
                }
              </InputMask>
            )}
          />

          <TextField
            variant="outlined" 
            label="Preço de venda"
            fullWidth
            type='number'
            {...register('selling_price')} // Converte o valor para número
            error={!!errors.selling_price}
            helperText={errors.selling_price?.message}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Controller
              name="selling_date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  label="Data de venda"
                  {...field}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      error: !!errors.selling_date,
                      helperText: errors.selling_date?.message
                    }
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <Box sx={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
            <Button variant="contained" color="secondary" type="submit">
              Salvar
            </Button>
            <Button variant="outlined" onClick={handleBackButtonClick}>
              Voltar
            </Button>
          </Box>

          {/* Debug: mostra o estado atual do formulário */}
          <Box sx={{ fontFamily: 'monospace', display: 'flex', flexDirection: 'column', width: '100%', mt: 4 }}>
            <Typography variant="h6">Form State (Debug):</Typography>
            <pre>{JSON.stringify(watch(), null, 2)}</pre>
          </Box>

        </form>
      </Box>
    </>
  )
}