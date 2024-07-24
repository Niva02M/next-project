import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

// assets
import { IconMessage } from '@tabler/icons-react';

// types
import { ThemeMode } from 'types/config';

// ==============================|| NOTIFICATION ||============================== //

const MessageSection = () => {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const [open, setOpen] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef<any>(null);

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
      <Box
        sx={{
          ml: 1,
          mr: 1
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...(downMD ? theme.typography.mediumAvatar : theme.typography.largeAvatar),
            transition: 'all .2s ease-in-out',
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'transparent',
            color: theme.palette.mode === ThemeMode.DARK ? 'warning.dark' : 'primary.main',
            border:
              theme.palette.mode === ThemeMode.DARK ? `1px solid ${theme.palette.secondary.main}` : `1px solid ${theme.palette.grey[200]}`,
            borderRadius: '50%',
            '&[aria-controls="menu-list-grow"],&:hover': {
              bgcolor: theme.palette.mode === ThemeMode.DARK ? 'secondary.main' : 'primary.dark',
              color: theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'primary.light',
              border:
                theme.palette.mode === ThemeMode.DARK
                  ? `1px solid ${theme.palette.secondary.light}`
                  : `1px solid ${theme.palette.primary.light}`
            }
          }}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          color="inherit"
        >
          <IconMessage stroke={1.5} size="20px" />
        </Avatar>
      </Box>
    </>
  );
};

export default MessageSection;
