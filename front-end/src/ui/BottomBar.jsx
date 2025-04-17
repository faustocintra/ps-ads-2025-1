import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import CoffeeIcon from '@mui/icons-material/Coffee';

export default function BottomBar() {
  return (
    <Toolbar
      variant="dense"
      sx={{
        backgroundColor: 'action.disabledBackground',
        justifyContent: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100vw',
      }}
    >
      <Typography
        variant="caption"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Desenvolvido e mantido com
        <CoffeeIcon fontSize="small" sx={{ mb: -0.5 }} />
        {' '}
        por
        <span style={{ marginLeft: '4px' }} /> {/* Adiciona um espaço extra */}
        <a href="https://github.com/peida-nao-xerequinha/ps-ads-2025-1">
          peida-nao-xerequinha
        </a>
        <img 
          src="../../../public/meme.jpg" 
          alt="peida-nao-xerecosa" 
          style={{ width: '25px', height: 'auto', marginLeft: '8px', borderRadius: '8px' }} 
        />
      </Typography>
    </Toolbar>
  );
}