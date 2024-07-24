import { useEffect, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';

// third-party
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
// types

// assets
import { IconLogout, IconSettings } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';
import { IconButton, useMediaQuery } from '@mui/material';
import LogoutModal from './logoutModal';
import useSuccErrSnack from 'hooks/useSuccErrSnack';

const User1 = '/assets/images/users/user-round.svg';

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = () => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  // const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { errorSnack } = useSuccErrSnack();

  const closeLogoutModal = () => {
    setIsLogoutOpen(false);
  };

  const openLogoutModal = () => {
    setIsLogoutOpen(true);
  };
  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      localStorage.clear();
      await signOut({ callbackUrl: '/login' });
    } catch (err) {
      errorSnack('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement>, index: number, route: string = '') => {
    setSelectedIndex(index);
    handleClose(event);

    // if (route && route !== '') {
    //     navigate(route);
    // }
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <IconButton onClick={handleToggle} sx={{ p: 0 }}>
        <Avatar
          src={User1}
          alt="user-images"
          sx={{
            ...(downMD ? theme.typography.mediumAvatar : theme.typography.largeAvatar),
            cursor: 'pointer'
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          color="inherit"
        />
      </IconButton>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        <List
                          component="nav"
                          sx={{
                            width: '100%',
                            maxWidth: 350,
                            minWidth: 300,
                            bgcolor: theme.palette.background.paper,
                            borderRadius: `${borderRadius}px`,
                            '& .MuiListItemButton-root': { mt: 0.5 }
                          }}
                        >
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 0}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                              handleListItemClick(event, 0, '/user/account-profile/profile1')
                            }
                          >
                            <ListItemIcon>
                              <IconSettings stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <FormattedMessage id="account-settings" />
                                </Typography>
                              }
                            />
                          </ListItemButton>
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 4}
                            onClick={openLogoutModal}
                          >
                            <ListItemIcon>
                              <IconLogout stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <FormattedMessage id="logout" />
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </List>
                      </Box>
                    </PerfectScrollbar>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
      <LogoutModal isOpen={isLogoutOpen} isLoading={isLoading} handleClose={closeLogoutModal} onLogout={handleLogout} />
    </>
  );
};

export default ProfileSection;
