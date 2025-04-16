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

import fetchAuth from '../../lib/fetchAuth'

export default function CarsForm() {

  const colors = [
    { value: 'AMARELO', label: 'AMARELO' },
    { value: 'AZUL', label: 'AZUL' },
    { value: 'BRANCO', label: 'BRANCO' },
    { value: 'CINZA', label: 'CINZA' },
    { value: 'DOURADO', label: 'DOURADO' },
    { value: 'LARANJA', label: 'LARANJA' },
    { value: 'MARROM', label: 'MARROM' },
    { value: 'PRATA', label: 'PRATA' },
    { value: 'PRETO', label: 'PRETO' },
    { value: 'ROSA', label: 'ROSA' },
    { value: 'ROXO', label: 'ROXO' },
    { value: 'VERDE', label: 'VERDE' },
    { value: 'VERMELHO', label: 'VERMELHO' },
  ]

  const platesMaskFormatChars = {
    '9': '[0-9]',
    '$': '[0-9A-J]',
    'A': '[A-Z]',
  }

  const years = [] 
  for (let year = new Date().getFullYear(); year >= 1951; year--) {
    years.push(year)
  }

  const formDefaults = {
    brand: '',
    model: '',
    color: '',
    year_manufacture: '',
    imported: false,
    plates: '',
    selling_price: '',
    selling_date: null
  }

  const navigate = useNavigate()
  const params = useParams()

  const [state, setState] = React.useState({
    cars: { ...formDefaults },
    formModified: false
  })
  const { cars, formModified } = state

  React.useEffect(() => {
    if (params.id) loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      const response = await fetchAuth(
        import.meta.env.VITE_API_BASE + '/cars/' + params.id 
      )
      const result = await response.json()
      if(result.selling_date) result.selling_date = parseISO(result.selling_date)
      setState({ ...state, cars: result, formModified: false })
    }
    catch(error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  function handleFieldChange(event) {
    const carsCopy = { ...cars }
    carsCopy[event.target.name] = event.target.value
    setState({ ...state, cars: carsCopy, formModified: true })
  }

  async function handleFormSubmit(event) {
    event.preventDefault()
    feedbackWait(true)
    try {
      const reqOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cars)
      }

      if(params.id) {
        reqOptions.method = 'PUT'
        await fetchAuth(
          import.meta.env.VITE_API_BASE + '/cars/' + params.id,
          reqOptions
        )
      }
      else {
        await fetchAuth(
          import.meta.env.VITE_API_BASE + '/cars',
          reqOptions
        )
      }

      feedbackNotify('Item salvo com sucesso.', 'success', 4000, () => {
        navigate('..', { relative: 'path', replace: true })
      })
    }
    catch(error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  async function handleBackButtonClick() {
    if(formModified && ! await feedbackConfirm('Há informações não salvas. Deseja realmente voltar?')) return
    navigate('..', { relative: 'path', 'replace': true })
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        {params.id ? `Editar veículo #${params.id}` : 'Cadastrar novo veículo'}
      </Typography>

      <Box className="form-fields">
        <form onSubmit={handleFormSubmit}>

          <TextField
            variant="outlined" 
            name="brand"
            label="Marca do carro"
            fullWidth
            required
            autoFocus
            value={cars.brand}
            onChange={handleFieldChange}
          />
          <TextField
            variant="outlined" 
            name="model"
            label="Modelo do carro"
            fullWidth
            required
            value={cars.model}
            onChange={handleFieldChange}
          />
          <TextField
            select
            variant="outlined" 
            name="color"
            label="Cor"
            fullWidth
            required
            value={cars.color}
            onChange={handleFieldChange}
          > 
            {colors.map(s => 
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            )}
          </TextField>
          <TextField
            select
            variant="outlined" 
            name="year_manufacture"
            label="Ano de fabricação"
            fullWidth
            required
            value={cars.year_manufacture}
            onChange={handleFieldChange}
          >
            {years.map(y => 
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            )}
          </TextField>

          <div className="MuiFormControl-root">
            <FormControlLabel
              control={
                <Checkbox
                  name='imported'
                  checked={cars.imported}
                  onChange={(event) => 
                    setState({ ...state, cars: { ...cars, imported: event.target.checked }, formModified: true })
                  }
                />
              }
              label='É importado?'
            />
          </div>    

          <InputMask
            mask='AAA-9$99'
            value={cars.plates}
            onChange={handleFieldChange}
            formatChars={platesMaskFormatChars}
          >
            {() => 
              <TextField
                variant="outlined" 
                name="plates"
                label="Placa" 
                fullWidth
                required
              />
            }
          </InputMask>

          <TextField
            variant="outlined" 
            name="selling_price"
            label="Preço de venda"
            fullWidth
            required
            type='number'
            value={cars.selling_price}
            onChange={handleFieldChange}
          />

          <LocalizationProvider 
            dateAdapter={AdapterDateFns}
            adapterLocale={ptBR}
          >
            <DatePicker
              label="Data de venda"
              value={cars.selling_date || null}
              slotProps={{
                textField: {
                  variant: 'outlined',
                  fullWidth: true
                }
              }}
              onChange={date => {
                const event = { target: { name: 'selling_date', value: date } }
                handleFieldChange(event)
              }}
            />
          </LocalizationProvider>

          <Box sx={{ 
            display: 'flex',
            justifyContent: 'space-around',
            width: '100%'
          }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
            >
              Salvar
            </Button>

            <Button
              variant="outlined"
              onClick={handleBackButtonClick}
            >
              Voltar
            </Button>
          </Box>

          <Box sx={{
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}>
            {JSON.stringify(cars, null, 2)}
          </Box>

        </form>
      </Box>
    </>
  )
}
