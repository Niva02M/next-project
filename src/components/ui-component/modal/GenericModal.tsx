'use client';
import React from 'react';
import { Button, IconButton, Modal, Paper, Stack, Typography, useTheme } from '@mui/material';
import { CloseIcon } from 'components/icons';
import { LoadingButton } from '@mui/lab';

interface IGenericModalProps {
  openModal: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  title?: string;
  maxWidth?: number;
  btnDirection?: 'column' | 'row';
  btnTextYes?: string;
  btnTextNo?: string;
  handleYes?: () => void;
  handleNo?: () => void;
  isLoading?: boolean;
  titleIcon?: React.ReactElement;
}

export default function GenericModal({
  title,
  openModal,
  closeModal,
  maxWidth = 830,
  btnDirection = 'row',
  btnTextYes,
  btnTextNo,
  handleYes,
  handleNo,
  isLoading,
  titleIcon,
  children,
}: IGenericModalProps) {
  const theme = useTheme();

  const handleClose = () => closeModal();

  return (
    <Modal open={openModal} onClose={handleClose}>
      <Paper
        sx={{
          width: { xs: '90%', md: '100%' },
          maxWidth: maxWidth,
          p: '27px 20px',
          maxHeight: '90%',
          overflowY: 'auto'
        }}
      >
        {title && (
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" gap={2} mb={2}>
            {titleIcon ? (
              <Stack
                direction="row"
                spacing={2.5}
                alignItems="flex-start"
                sx={{
                  svg: {
                    width: 24,
                    path: {
                      fill: theme.palette.error.dark
                    }
                  }
                }}
              >
                {titleIcon}
                <Typography variant="h3" flex={1}>
                  {title}
                </Typography>
              </Stack>
            ) : (
              <Typography variant="h3">{title}</Typography>
            )}
            <IconButton onClick={handleClose} sx={{ p: 0 }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        )}
        {children}
        <Stack
          direction={btnDirection}
          spacing={btnDirection === 'column' ? 3 : 2}
          mt={2}
          justifyContent={btnDirection === 'row' ? 'flex-end' : 'flex-start'}
          sx={{
            '.MuiButton-root': {
              minWidth: 80
            }
          }}
        >
          {btnTextNo && (
            <Button
              onClick={() => {
                handleClose();
                handleNo?.();
              }}
              variant="outlined"
              color="primary"
            >
              {btnTextNo}
            </Button>
          )}
          {btnTextYes && (
            <LoadingButton loading={isLoading} disabled={isLoading} onClick={handleYes} variant="contained" color="primary">
              {btnTextYes}
            </LoadingButton>
          )}
        </Stack>
      </Paper>
    </Modal>
  );
}
