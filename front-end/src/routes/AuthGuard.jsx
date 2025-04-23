import React from 'react'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { Navigate, useLocation, useNavigate } from 'react-router-dom'

import { feedbackWait } from '../ui/Feedback'
import AuthContext from '../contexts/AuthContext'
import fetchAuth from '../lib/fetchAuth'

export default function AuthGuard({ children, userLevel = 0 }) {
  /*
    userLevel:
    0 ~> rota pode ser acessada mesmo sem usuário autenticado (padrão)
    1 ~> rota exige usuário autenticado para ser acessada
    2 ~> rota exige usuário autenticado e administrador para ser acessada
  */

  const { authState, setAuthState } = React.useContext(AuthContext)
  const {
    authUser,
    redirectTo
  } = authState

  const [status, setStatus] = React.useState('IDLE')

  const navigate = useNavigate()
  const location = useLocation()

  async function checkAuthUser() {
    /*
      Sempre que se tentar acessar uma nova rota de front-end, esta
      função será executada para consultar o back-end se há um usuário
      autenticado
    */
    setStatus('PROCESSING')
    feedbackWait(true)
    try {
      const user = await fetchAuth.get('/users/me')
      setAuthState({ ...authState, authUser: user })
    }
    catch(error) {
      setAuthState({ ...authState, authUser: null })
      console.error(error)
      navigate('/login', { replace: true })
    }
    finally {
      feedbackWait(false)
      setStatus('DONE')
    }
  }

  // Este useEffect será executado sempre que a rota (location) for alterada
  React.useEffect(() => {
    /*
      Salva a rota atual para posterior redirecionamento (caso a rota atual
      não seja o próprio login)
    */
    if(! location.pathname.includes('login')) {
      setAuthState({ ...authState, redirectTo: location })
    }

    checkAuthUser()
  }, [location])
}