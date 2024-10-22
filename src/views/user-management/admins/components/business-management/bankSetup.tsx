'use-client';
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Formik } from 'formik';
// material-ui
import { Button, CircularProgress, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';

import { GENERATE_ACCOUNT_ONBOARDING_LINK, CREATE_CUSTOM_CONNECT_ACCOUNT } from './graphql/mutations';
import useSuccErrSnack from 'hooks/useSuccErrSnack';
import AddPaymentDetailModal from '../modal/AddPaymentDetailModal';
import AlignCenter from 'components/align-center/AlignCenter';
import { GET_MY_BANK_DETAIL } from './graphql/queries';
import PayoutCard from './PayoutCard';

// grapqhl

// ==============================|| BANK SETUP ||============================== //

const bankAccounTypeMap = {
  standard: 'STANDARD',
  express: 'EXPRESS',
  custom: 'CUSTOM',
  customForm: 'CUSTOM-FORM'
};
type BankAccountTypeKeys = keyof typeof bankAccounTypeMap;

const BankSetupPage = () => {
  const [pageLoading, setPageLoading] = useState(false);
  const { successSnack, errorSnack } = useSuccErrSnack();
  const [openModal, setOpenModal] = useState(false);
  const { data: dataBankDetail, loading: loadingBankDetail, refetch } = useQuery(GET_MY_BANK_DETAIL);
  const [handleGenerateBankAccount, { data, loading }] = useMutation(GENERATE_ACCOUNT_ONBOARDING_LINK);
  const [handleGenerateCustomAccountOnboarding] = useMutation(CREATE_CUSTOM_CONNECT_ACCOUNT);

  const handleFormSubmit = async (
    values: {
      bankAccountType: string;
    },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      setPageLoading(true);
      if (values.bankAccountType === 'custom') {
        const { data: connectAccount } = await handleGenerateCustomAccountOnboarding({
          variables: {}
        });
        if (connectAccount?.generateCustomAccountOnboardingLink?.connectAccountId) {
          await handleGenerateBankAccount({
            variables: {
              body: {
                bankAccountType: bankAccounTypeMap[values.bankAccountType],
                connectAccountId: connectAccount?.generateCustomAccountOnboardingLink?.connectAccountId
              }
            }
          });
          setPageLoading(false);
        }
      } else {
        await handleGenerateBankAccount({
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
    if (data?.generateAccountOnboardingLink) {
      successSnack('Account link created successfully');
      setTimeout(() => {
        window.location.href = data?.generateAccountOnboardingLink?.url;
      }, 2000);
    }
  }, [data]);

  if (loadingBankDetail) {
    return (
      <AlignCenter>
        <CircularProgress />
      </AlignCenter>
    );
  }

  if (dataBankDetail?.getUserStripeAccountDetails) {
    return <PayoutCard detail={dataBankDetail?.getUserStripeAccountDetails} refetch={refetch} />;
  }

  return pageLoading ? (
    <AlignCenter>
      <CircularProgress />
    </AlignCenter>
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
          handleChange,
          handleSubmit,
          isSubmitting
          /* and other goodies */
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Typography variant="h3" mb={2}>
                Setup bank
              </Typography>
              <Stack spacing={1.5} alignItems={'flex-start'}>
                <FormControl>
                  <FormLabel>Bank account type</FormLabel>
                  <RadioGroup defaultValue="standard" name="bankAccountType">
                    <FormControlLabel value="standard" control={<Radio />} label="Standard" onChange={handleChange} />
                    <FormControlLabel value="express" control={<Radio />} label="Express" onChange={handleChange} />
                    <FormControlLabel value="custom" control={<Radio />} label="Custom" onChange={handleChange} />
                    <FormControlLabel value="customForm" control={<Radio />} label="Custom Form" onChange={handleChange} />
                  </RadioGroup>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  type={values.bankAccountType !== 'customForm' ? 'submit' : 'button'}
                  disabled={isSubmitting || loading}
                  endIcon={<ArrowRightAltRoundedIcon />}
                  size="large"
                  {...(values.bankAccountType === 'customForm' && { onClick: () => setOpenModal(true) })}
                >
                  Onboard
                </Button>
              </Stack>
            </form>
          );
        }}
      </Formik>
      <AddPaymentDetailModal openModal={openModal} setOpenModal={setOpenModal} refetch={refetch} />
    </>
  );
};

export default BankSetupPage;
