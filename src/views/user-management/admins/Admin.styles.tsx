import { Box, styled } from '@mui/material';

export const UploadAvatar = styled(Box)(({ theme }) => ({
  position: 'relative',

  'input[type="file"]': {
    position: 'absolute',
    opacity: 0,
    width: 62,
    height: 62,
    zIndex: 1
  },
  '.MuiAvatar-root': {
    width: 62,
    height: 62
  }
}));
