import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
// material-ui
import { Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup } from '@mui/material';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';

// assets
import MainCard from 'ui-component/cards/MainCard';

import { CREATE_BANK_ACCOUNT_LINK, CREATE_CUSTOM_CONNECT_ACCOUNT } from './graphql/mutations';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import AddPaymentDetailModal from '../modal/AddPaymentDetailModal';

// grapqhl

// ==============================|| BANK SETUP ||============================== //

const bankAccounTypeMap = {
  standard: 'STANDARD',
  express: 'EXPRESS',
  custom: 'CUSTOM'
};
type BankAccountTypeKeys = keyof typeof bankAccounTypeMap;

const BankSetupPage = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [handleCreateBankAccount, { data, loading }] = useMutation(CREATE_BANK_ACCOUNT_LINK);
  const [handleCreateCustomConnectAccount] = useMutation(CREATE_CUSTOM_CONNECT_ACCOUNT);

  const handleFormSubmit = async (
    values: {
      bankAccountType: string;
    },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      setPageLoading(true);
      if (values.bankAccountType === 'custom') {
        const { data: connectAccount } = await handleCreateCustomConnectAccount({
          variables: {}
        });
        if (connectAccount?.createCustomConnectAccount?.connectAccountId) {
          await handleCreateBankAccount({
            variables: {
              body: {
                bankAccountType: bankAccounTypeMap[values.bankAccountType],
                connectAccountId: connectAccount?.createCustomConnectAccount?.connectAccountId
              }
            }
          });
          setPageLoading(false);
        }
      } else {
        await handleCreateBankAccount({
          variables: {
            body: { bankAccountType: bankAccounTypeMap[values.bankAccountType as BankAccountTypeKeys] }
          }
        });
      }
      setSubmitting(false);
    } catch (error: any) {
      setPageLoading(false);
      errorSnack(error.message || 'Error while submitting file');
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (data?.createBankAccountLink) {
      successSnack('Account link created successfully');
      setTimeout(() => {
        window.location.href = data?.createBankAccountLink?.url;
      }, 2000);
    }
  }, [data]);

  return pageLoading ? (
    <CircularProgress />
  ) : (
    <>
      <Formik
        enableReinitialize
        initialValues={{ bankAccountType: 'standard' }}
        onSubmit={(values, { setSubmitting }) => {
          handleFormSubmit(values, setSubmitting);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          isSubmitting
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <MainCard title="Setup Bank" sx={{ position: 'relative' }}>
              <Grid container spacing={2} alignItems="center">
                <Grid display="flex" flexDirection={'column'} item xs={12} sm={10} md={8} lg={5}>
                  <FormControl>
                    <FormLabel>Account Type</FormLabel>
                    <RadioGroup defaultValue="standard" name="bankAccountType">
                      <FormControlLabel value="standard" control={<Radio />} label="Standard" onChange={handleChange} />
                      <FormControlLabel value="express" control={<Radio />} label="Express" onChange={handleChange} />
                      <FormControlLabel value="custom" control={<Radio />} label="Custom" onChange={handleChange} />
                    </RadioGroup>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    disabled={isSubmitting || loading}
                    endIcon={<ArrowRightAltRoundedIcon />}
                    sx={{
                      maxWidth: '50%',
                      marginTop: '1rem'
                    }}
                  >
                    Onboard
                  </Button>
                </Grid>
              </Grid>
            </MainCard>
          </form>
        )}
      </Formik>
      <AddPaymentDetailModal open={open} setOpen={setOpen} openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default BankSetupPage;
