import { useTheme } from '@mui/material/styles';
import { Box, Divider, IconButton, Modal, Stack, Typography } from '@mui/material';
import React from 'react';
import { LoadingButton } from '@mui/lab';
import { IconClose } from 'constants/icons';

interface ILogoutProps {
  isOpen: boolean;
  isLoading: boolean;
  onLogout: () => void;
  handleClose: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 638,
  bgcolor: 'background.paper',
  p: 3,
  borderRadius: '4px'
};

export default function LogoutModal({ handleClose, onLogout, isOpen, isLoading }: ILogoutProps) {
  const theme = useTheme();
  return (
    <Modal open={isOpen} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Box sx={style}>
        <Stack direction="row" justifyContent="space-between" columnGap={2}>
          <Typography
            id="modal-modal-title"
            variant="h3"
            component="h3"
            className="poppins-font"
            fontWeight="700"
            color={theme.palette.dark.main}
          >
            Logout
          </Typography>
          <IconButton className="close" onClick={handleClose}>
            <IconClose />
          </IconButton>
        </Stack>
        <Stack
          rowGap={2}
          sx={{
            a: {
              color: theme.palette.primary[500],
              fontWeight: '600',
              textDecoration: 'none',

              '&:hover': {
                color: theme.palette.primary[800],
                textDecoration: 'underline'
              }
            }
          }}
        >
          <Typography id="modal-modal-description" sx={{ mt: 3 }} color={theme.palette.secondary.main} fontWeight="500">
            Are you sure you want to logout Ebtheme web?
          </Typography>
        </Stack>

        <Divider sx={{ margin: '24px 0' }} />
        <LoadingButton loading={isLoading} disabled={isLoading} className="gradient" size="large" onClick={onLogout} fullWidth>
          Log Out
        </LoadingButton>
      </Box>
    </Modal>
  );
}
