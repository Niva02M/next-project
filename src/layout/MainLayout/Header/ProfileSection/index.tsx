import { useEffect, useRef, useState } from 'react';
import { signOut } from 'next-auth/react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
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
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
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
                    {/* <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="h4">Good Morning,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {user?.name} 
                          </Typography>
                        </Stack>
                        <Typography variant="subtitle2">Project Admin</Typography>
                      </Stack>
                      <OutlinedInput
                        sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                        id="input-search-profile"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Search profile options"
                        startAdornment={
                          <InputAdornment position="start">
                            <IconSearch stroke={1.5} size="16px" />
                          </InputAdornment>
                        }
                        aria-describedby="search-helper-text"
                        inputProps={{
                          'aria-label': 'weight'
                        }}
                      />
                      <Divider />
                    </Box> */}
                    <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                      <Box sx={{ p: 2, pt: 0 }}>
                        {/* <UpgradePlanCard />
                        <Divider />
                        <Card sx={{ bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.800' : 'primary.light', my: 2 }}>
                          <CardContent>
                            <Grid container spacing={3} direction="column">
                              <Grid item>
                                <Grid item container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1">Start DND Mode</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Switch
                                      color="primary"
                                      checked={sdm}
                                      onChange={(e) => setSdm(e.target.checked)}
                                      name="sdm"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item>
                                <Grid item container alignItems="center" justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="subtitle1">Allow Notifications</Typography>
                                  </Grid>
                                  <Grid item>
                                    <Switch
                                      checked={notification}
                                      onChange={(e) => setNotification(e.target.checked)}
                                      name="sdm"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                        <Divider /> */}
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
                            selected={selectedIndex === 1}
                            onClick={(event: React.MouseEvent<HTMLDivElement>) =>
                              handleListItemClick(event, 1, '/user/social-profile/posts')
                            }
                          >
                            <ListItemIcon>
                              <IconUser stroke={1.5} size="20px" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Grid container spacing={1} justifyContent="space-between">
                                  <Grid item>
                                    <Typography variant="body2">
                                      <FormattedMessage id="social-profile" />
                                    </Typography>
                                  </Grid>
                                  <Grid item>
                                    <Chip label="02" size="small" color="warning" sx={{ '& .MuiChip-label': { mt: 0.25 } }} />
                                  </Grid>
                                </Grid>
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
