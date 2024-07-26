'use client';
import React, { ReactElement, useEffect, useState } from 'react';

import { Button, IconButton, Modal, Paper, Stack, Typography, useTheme } from '@mui/material';
import { CloseIcon } from 'components/icons';
import { LoadingButton } from '@mui/lab';

interface IGenericModalProps {
  open: boolean;
  setOpen: any;
  title?: string;
  children: any;
  openModal: boolean;
  closeModal: any;
  maxWidth?: number;
  btnDirection?: 'column' | 'row';
  btnTextYes?: string;
  btnTextNo?: string;
  handleYes?: () => void;
  handleNo?: () => void;
  isLoading?: boolean;
  titleIcon?: ReactElement;
}

export default function GenericModal({
  title,
  openModal,
  closeModal,
  maxWidth,
  btnDirection,
  btnTextYes,
  btnTextNo,
  handleYes,
  handleNo,
  isLoading,
  titleIcon,
  children
}: IGenericModalProps) {
  const theme = useTheme();
  let [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    closeModal(true);
  };
  useEffect(() => {
    if (openModal) {
      handleOpen();
    }
  }, [openModal]);
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Paper sx={{ width: { xs: '90%', md: '100%' }, maxWidth: maxWidth ? maxWidth : 830, p: 3 }}>
          {title && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" columnGap={2} mb={2}>
              {titleIcon ? (
                <Stack
                  direction="row"
                  spacing={2.5}
                  alignItems="center"
                  sx={{
                    svg: {
                      width: 24,
                      path: {
                        fill: theme.palette.error.dark
                      }
                    }
                  }}
                >
                  {titleIcon}{' '}
                  <Typography variant="h3" flex={1}>
                    {title}
                  </Typography>{' '}
                </Stack>
              ) : (
                <Typography variant="h3">{title}</Typography>
              )}
              <IconButton className="close" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          )}
          {children}
          {btnDirection === 'column' && (
            <Stack direction={btnDirection} spacing={3} mt={2}>
              {btnTextNo && (
                <Button
                  onClick={() => {
                    handleClose();
                    handleNo;
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
          )}
          {btnDirection === 'row' && (
            <Stack direction={btnDirection} spacing={3} mt={2}>
              {btnTextYes && (
                <LoadingButton
                  loading={isLoading}
                  disabled={isLoading}
                  onClick={handleYes}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {btnTextYes}
                </LoadingButton>
              )}
              {btnTextNo && (
                <Button onClick={handleNo} variant="outlined" color="primary" size="large">
                  {btnTextNo}
                </Button>
              )}
            </Stack>
          )}
        </Paper>
      </Modal>
    </>
  );
}
