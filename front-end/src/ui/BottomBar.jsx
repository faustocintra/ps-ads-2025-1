import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LiquorIcon from '@mui/icons-material/Liquor';

export default function BottomBar() {
  return (
    <Toolbar
      variant="dense"
      sx={{
        backgroundColor: 'action.disabledBackground',
        justifyContent: 'center',  // CORRETO: Centraliza o conteúdo
        position: 'fixed',
        bottom: 0,
        width: '100vw'
      }}
    >
      <Typography
        variant="body1"
        gutterBottom
        sx={{
          '& a': {
            color: 'secondary.light'
          }
        }}
      >
        Desenvolvido e mantido com
        <LiquorIcon fontSize="large" sx={{ mb: -0.5, mx: 0.5 }} /> {}
        por
        <span style={{ marginLeft: '4px' }} />
        <a href="https://github.com/peida-nao-xerequinha/ps-ads-2025-1">
          peida-nao-xerequinha
        </a>
        <img 
          src="/meme.jpg" 
          alt="peida-nao-xerecosa" 
          style={{ width: '25px', height: 'auto', marginLeft: '8px', borderRadius: '8px', verticalAlign: 'middle' }} 
        />
      </Typography>
    </Toolbar>
  )
}