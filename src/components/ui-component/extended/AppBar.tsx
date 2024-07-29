'use client';

import { cloneElement, useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// project imports
import Logo from '../Logo';

// assets
import MenuIcon from '@mui/icons-material/Menu';

// types
import { ThemeMode } from 'types/config';
import pageRoutes from 'constants/routes';

// elevation scroll
interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | Node;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window!
  });

  return cloneElement(children, {
    elevation: trigger ? 1 : 0,
    style: {
      backgroundColor: theme.palette.mode === ThemeMode.DARK && trigger ? theme.palette.dark[800] : theme.palette.background.default,
      color: theme.palette.text.dark
    }
  });
}

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

const AppBar = ({ ...others }) => {
  const theme = useTheme();
  const [drawerToggle, setDrawerToggle] = useState<boolean>(false);

  const drawerToggler = (open: boolean) => (event: any) => {
    if (event.type! === 'keydown' && (event.key! === 'Tab' || event.key! === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  return (
    <ElevationScroll {...others}>
      <MuiAppBar>
        <Container>
          <Toolbar sx={{ py: 2.5, px: `0 !important` }}>
            <Typography sx={{ flexGrow: 1, textAlign: 'left', svg: { width: 'auto', height: 45 } }}>
              <Logo />
            </Typography>
            <Stack
              direction="row"
              sx={{
                display: {
                  xs: 'none',
                  sm: 'block',
                  '.MuiLink-root': {
                    paddingLeft: 0,
                    paddingRight: 0,
                    minWidth: 'auto',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: theme.palette.primary.dark
                    }
                  }
                }
              }}
              spacing={{ xs: 1.5, md: 3 }}
            >
              <Button color="inherit" component={Link} href="/home">
                Home
              </Button>
              <Button color="inherit" component={Link} href="/about-us">
                About us
              </Button>
              <Button color="inherit" component={Link} href="/contact-us">
                Contact us
              </Button>
              <Button color="inherit" component={Link} href="/faqs">
                Faq
              </Button>
              <Button href={pageRoutes.login} disableElevation variant="contained" color="primary">
                Login
              </Button>
            </Stack>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
                <MenuIcon />
              </IconButton>
              <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
                {drawerToggle && (
                  <Box sx={{ width: 'auto' }} role="presentation" onClick={drawerToggler(false)} onKeyDown={drawerToggler(false)}>
                    <List>
                      <Link sx={{ textDecoration: 'none' }} href="/home">
                        <ListItemButton>
                          <ListItemText primary="Home" />
                        </ListItemButton>
                      </Link>
                      <Link sx={{ textDecoration: 'none' }} href="/about-us">
                        <ListItemButton>
                          <ListItemText primary="About us" />
                        </ListItemButton>
                      </Link>
                      <Link sx={{ textDecoration: 'none' }} href="/contact-us">
                        <ListItemButton>
                          <ListItemText primary="Contact us" />
                        </ListItemButton>
                      </Link>
                      <Link sx={{ textDecoration: 'none' }} href="/faqs">
                        <ListItemButton>
                          <ListItemText primary="Faq" />
                        </ListItemButton>
                      </Link>
                      <Button component={Link} href={pageRoutes.login} disableElevation variant="contained" color="primary" sx={{ m: 2 }}>
                        Login
                      </Button>
                    </List>
                  </Box>
                )}
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    </ElevationScroll>
  );
};

export default AppBar;
