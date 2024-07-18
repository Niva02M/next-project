// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import useConfig from 'hooks/useConfig';
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
// import MegaMenuSection from './MegaMenuSection';
import NotificationSection from './NotificationSection';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// assets
import { IconMenu2 } from '@tabler/icons-react';

// types
import { MenuOrientation, ThemeMode } from 'types/config';
import MessageSection from './MessageSection';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuOrientation } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: 'auto', display: 'flex' }}>
        <Box component="span" sx={{ svg: { height: 45 } }}>
          <LogoSection />
        </Box>
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      {/* mega-menu */}
      {/* <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MegaMenuSection />
      </Box> */}
      <MessageSection />

      {/* notification */}
      <NotificationSection />

      {/* profile */}
      <ProfileSection />

      <Box ml={1}>
        {!isHorizontal && (
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...(downMD ? theme.typography.mediumAvatar : theme.typography.largeAvatar),
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'transparent',
              color: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'primary.main',
              border:
                theme.palette.mode === ThemeMode.DARK
                  ? `1px solid ${theme.palette.secondary.main}`
                  : `1px solid ${theme.palette.grey[200]}`,
              borderRadius: '50%',
              '&:hover': {
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'primary.dark',
                color: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'primary.light',
                border:
                  theme.palette.mode === ThemeMode.DARK
                    ? `1px solid ${theme.palette.secondary.light}`
                    : `1px solid ${theme.palette.primary.light}`
              }
            }}
            onClick={() => handlerDrawerOpen(!drawerOpen)}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
        )}
      </Box>
    </>
  );
};

export default Header;
