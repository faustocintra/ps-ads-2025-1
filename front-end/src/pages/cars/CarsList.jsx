import Typography from '@mui/material/Typography'
import * as React from 'react';
import Paper from '@mui/material/Paper';
import { DataGrid } from '@mui/x-data-grid';
import { feedbackWait, feedbackNotify, feedbackConfirm } from '../../ui/Feedback'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import IconButton from '@mui/material/IconButton'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import AddCircleIcon from '@mui/icons-material/AddCircle'

import fetchAuth from '../../lib/fetchAuth'

export default function CarsList() {

  const columns = [
    { 
      field: 'id', 
      headerName: 'Cód.', 
      width: 90 
    },
    {
      field: 'brand_model',
      headerName: 'Marca/Modelo',
      width: 200,
      valueGetter: (value, row) => `${row.brand} / ${row.model}`
    },
    {
      field: 'color',
      headerName: 'Cor',
      width: 150,
    },
    {
      field: 'year_manufacture',
      headerName: 'Ano de fabricação',
      width: 170,
    },
    {
      field: 'imported',
      headerName: 'É Importado?',
      width: 140,
      valueGetter: (value, row) => row.imported ? 'SIM' : ''
    },
    {
      field: 'plates',
      headerName: 'Placas',
      width: 130,
    },
    {
      field: 'selling_price',
      headerName: 'Preço de venda',
      width: 160,
      valueGetter: (value, row) => 
        row.selling_price?.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })
    },
    {
      field: 'selling_date',
      headerName: 'Data de venda',
      width: 150,
      valueGetter: (value, row) => 
        row.selling_date ? new Date(row.selling_date).toLocaleDateString('pt-BR') : ''
    },
    {
      field: '_actions',
      headerName: 'Ações',
      width: 150,
      sortable: false,
      renderCell: params => {
        return <>
          <Link to={'./' + params.id}>
            <IconButton aria-label="editar">
              <EditIcon />
            </IconButton>
          </Link>

          <IconButton 
            aria-label="excluir"
            onClick={() => handleDeleteButtonClick(params.id)}
          >
            <DeleteForeverIcon color="error" />
          </IconButton>
        </>
      }
    }
  ];

  const [state, setState] = React.useState({
    cars: []
  })

  const { cars } = state

  React.useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    feedbackWait(true)
    try {
      const result = await fetchAuth.get('/cars?by=brand')
      setState({ ...state, cars: result })
    }
    catch (error) {
      console.log(error)
      feedbackNotify('ERRO: ' + error.message, 'error')
    }
    finally {
      feedbackWait(false)
    }
  }

  async function handleDeleteButtonClick(id) {
    if(await feedbackConfirm('Deseja realmente excluir este item?')) {
      feedbackWait(true)
      try {
        await fetchAuth.delete(`/cars/${id}`)
        loadData()
        feedbackNotify('Exclusão efetuada com sucesso.')
      }
      catch (error) {
        console.log(error)
        feedbackNotify('ERRO: ' + error.message, 'error')
      }
      finally {
        feedbackWait(false)
      }
    }
  }

  return (
    <>
      <Typography variant="h1" gutterBottom>
        Listagem de veículos
      </Typography>

      <Box sx={{
        display: 'flex',
        justifyContent: 'right',
        mb: 2
      }}>
        <Link to="./new">
          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            startIcon={ <AddCircleIcon /> }
          >
            Novo veículo
          </Button>
        </Link>
      </Box>

      <Paper elevation={8} sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={cars}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Paper>
    </>
  )
}
