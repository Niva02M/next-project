// material-ui
import { useEffect, useState } from 'react';
import { Button, TextField, Typography, FormHelperText } from '@mui/material';

// project imports
import { Box } from '@mui/system';
import { Formik } from 'formik';
import * as Yup from 'yup';

import useGQL from '../hooks/useGQL';
import { Admin } from '../constants/types';
import { dispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Spinner from 'components/spinner';
import FailureLoad from 'components/spinner/fail';
import CustomLoader from 'components/loader';
// ==============================|| SECURITY ||============================== //
type Props = {
    adminId: string;
};
const Security = ({ adminId }: Props) => {
    const [user, setUser] = useState<Admin>();
    const { GET_ADMIN, SEND_PASSWORD_RESET_MAIL } = useGQL();
    const { error, loading, data, refetch } = GET_ADMIN(adminId!);
    const [handleMail, { error: mailError, loading: mailLoading, data: mailData }] = SEND_PASSWORD_RESET_MAIL();

    useEffect(() => {
        if (data?.getAdmin) {
            setUser(data.getAdmin.admin);
        }
    }, [data]);
    useEffect(() => {
        refetch();
    }, []);
    useEffect(() => {
        if (mailData?.sendPasswordResetMail) {
            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Password reset mail sent',
                    variant: 'alert',
                    anchorOrigin: { vertical:'bottom', horizontal: 'center' },
                    alert: {
                        color: 'success'
                    }
                })
            );
        }
    }, [mailData]);

    const handleMailSend = async (values) => {
        await handleMail({
            variables: {
                userId: adminId,
                name: user?.firstName && user?.lastName ? user.firstName + user.lastName : values.authProviderId,
                email: values.authProviderId
            }
        });
    };
    if (loading || !user) {
        return <CustomLoader  />;
    }

    if (error) {
        return <FailureLoad />;
    }

    return (
        <>
            <Typography variant="h3" sx={{ mb: '0.5em' }}>
                Send reset password link
            </Typography>
            <Formik
                enableReinitialize
                initialValues={{ authProviderId: user?.email || '' }}
                validationSchema={Yup.object().shape({
                    authProviderId: Yup.string().email('Email Address format is not match').required('Email Address is required')
                })}
                onSubmit={async (values, { setSubmitting }) => {
                    handleMailSend(values);
                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <Typography variant="body2">Email</Typography>
                        <TextField
                            type="text"
                            id="authProviderId"
                            value={values.authProviderId}
                            placeholder="Email"
                            fullWidth
                            variant="outlined"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            disabled
                        />
                        {touched.authProviderId && errors.authProviderId && (
                            <FormHelperText error id="email-error">
                                {errors.authProviderId}
                            </FormHelperText>
                        )}
                        <Box sx={{ mt: '1em' }}>
                            <Button disabled={isSubmitting} type="submit" variant="contained" color="primary">
                                Send Link
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default Security;
