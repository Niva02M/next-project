import { memo, useMemo } from 'react';

// material-ui
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// types
// import { MenuOrientation } from 'types/config';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const theme = useTheme();
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { miniDrawer } = useConfig();

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: '5px 16px', svg: { height: 45 } }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawer = useMemo(() => {
    // const isVerticalOpen = menuOrientation === MenuOrientation.VERTICAL && drawerOpen;
    // const drawerContent = (
    //   <Stack direction="row" justifyContent="center" sx={{ mb: 2 }}>
    //     <Chip label={process.env.REACT_APP_VERSION} disabled chipcolor="secondary" size="small" sx={{ cursor: 'pointer' }} />
    //   </Stack>
    // );

    let drawerSX = {
      paddingLeft: '5px',
      paddingRight: '5px',
      marginTop: '20px'
    };

    if (drawerOpen)
      drawerSX = {
        paddingLeft: '5px',
        paddingRight: '5px',
        marginTop: '0px'
      };

    return (
      <>
        {downMD ? (
          <Box sx={drawerSX} className="mobile-nav">
            <MenuList />
          </Box>
        ) : (
          <PerfectScrollbar className="main-nav" style={{ height: 'calc(100vh - 61px)', ...drawerSX }}>
            <MenuList />
          </PerfectScrollbar>
        )}
      </>
    );
  }, [downMD, drawerOpen]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
      {downMD || (miniDrawer && drawerOpen) ? (
        <Drawer
          className="main-nav"
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          sx={{
            '& .MuiDrawer-paper': {
              mt: downMD ? 0 : 11,
              zIndex: 1099,
              width: drawerWidth,
              bgcolor: 'background.default',
              color: 'text.primary',
              borderRight: `1px solid ${theme.palette.grey[300]}`
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {downMD && logo}
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {logo}
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
};

export default memo(Sidebar);
