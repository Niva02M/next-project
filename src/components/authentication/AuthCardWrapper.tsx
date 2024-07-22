// material-ui
import Box from '@mui/material/Box';

// project import
import MainCard, { MainCardProps } from 'ui-component/cards/MainCard';

// ==============================|| AUTHENTICATION CARD WRAPPER ||============================== //

const AuthCardWrapper = ({ children, ...other }: MainCardProps) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 642 },
      minHeight: { lg: 690 },
      margin: { xs: '20px', md: '24px' },
      display: 'flex',
      alignItems: 'center',

      '& > *': {
        flexGrow: 1,
        flexBasis: '50%'
      }
    }}
    content={false}
    {...other}
  >
    <Box
      sx={{
        p: { xs: 2, sm: 3, lg: '45px 79px' },
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {children}
    </Box>
  </MainCard>
);

export default AuthCardWrapper;
