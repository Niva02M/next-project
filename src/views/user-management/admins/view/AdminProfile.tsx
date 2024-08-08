// material-ui
import { useEffect, useRef, useState } from 'react';
import { Button, FormHelperText, Grid, InputLabel, MenuItem, Stack, TextField } from '@mui/material';
import { Formik } from 'formik';

import FailureLoad from 'components/spinner/fail';
import useSnackbar from 'hooks/common/useSnackbar';
import ConfirmModal from 'components/modal/ConfirmModal';
// import { Admin } from 'types/admin';

import useGQL from '../hooks/useGQL';

import { AdminRoles, gridSpacing } from 'store/constant';

// assets
import { dispatch } from 'store';
import { closeModal, openModal } from 'store/slices/modal';
import { defaultAdmin, validateCreateOrEdit } from '../constants/variables';
// import { validateCreateOrEdit } from '../validations';
import { userRole } from 'constants/profile';
import { AdminProfile, status } from '../constants/types';
import CustomLoader from 'components/loader';

// ==============================|| PROFILE 2 - USER PROFILE ||============================== //
const AdminProfileView = ({ adminId, isView }) => {
    const { handleOpenSnackbar } = useSnackbar();

    const [adminProfile, setAdminProfile] = useState<Partial<AdminProfile>>(defaultAdmin);
    const { GET_ADMIN, UPDATE_ADMIN } = useGQL();
    const { error, loading, data, refetch } = GET_ADMIN(adminId!);
    const [handleUpdate, { data: update }] = UPDATE_ADMIN();
    const [isConfirmed, setIsConfirmed] = useState<Boolean>(false);

    const formRef = useRef<any>();

    useEffect(() => {
        refetch();
    }, [data]);

    useEffect(() => {
        if (update?.updateAdmin) {
            handleOpenSnackbar({ message: update.updateAdmin.message, alertType: 'success' });
            window.location.reload();
        }
    }, [update]);

    useEffect(() => {
        if (data?.getAdmin) {
            let { _id, firstName, lastName, email, phone, status, role } = data.getAdmin.admin;

            phone = phone || '';

            const validRoles = new Set([AdminRoles.SUPERADMIN, AdminRoles.ADMIN, AdminRoles.EDITOR]);
            role = validRoles.has(role) ? role : AdminRoles.EDITOR;

            setAdminProfile({ _id, firstName, lastName, email, phone, status, role });
        }
    }, [loading, data]);

    const handleSubmitExternally = () => {
        setIsConfirmed(true);
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const handleOpenModal = () => {
        dispatch(
            openModal({
                isOpen: true
            })
        );
    };

    const handleProfileUpdate = async (values: Partial<AdminProfile>, setSubmitting: (isSubmitting: boolean) => void) => {
        try {
            const {_id, email, role, ...input} = { ...values };
            await handleUpdate({ variables: { id: adminProfile._id!, input: { ...input, phone: values.phone } } });
        } catch (err: any) {
            handleOpenSnackbar({ message: err.message, alertType: 'error' });
            setSubmitting(false);
        }
    };

    const handleUserProfileUpdate = (values, setSubmitting) => {
        const input = { ...values };
        delete input._id;

        if(!isConfirmed){
            handleOpenModal();
            return false;
        }

        setSubmitting(true);
        handleProfileUpdate(input, setSubmitting);
        dispatch(closeModal());
    };

    return (
        <Grid container spacing={gridSpacing}>
            {loading ? (
                <Grid item xs={12}>
                    <CustomLoader  />
                </Grid>
            ) : error ? (
                <FailureLoad />
            ) : (
                <>
                    <Grid item xs={12}>
                        <Formik
                            innerRef={formRef}
                            enableReinitialize
                            initialValues={adminProfile}
                            validationSchema={validateCreateOrEdit}
                            onSubmit={async (values, { setSubmitting }) => handleUserProfileUpdate(values, setSubmitting)}
                        >
                            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2.8}>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>First name</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter first name"
                                                value={values.firstName}
                                                name="firstName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isView}
                                            />
                                            {touched.firstName && errors.firstName && (
                                                <FormHelperText error id="firstName-error">
                                                    {errors.firstName}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Last name</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter last name"
                                                value={values.lastName}
                                                name="lastName"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isView}
                                            />
                                            {touched.lastName && errors.lastName && (
                                                <FormHelperText error id="lastName-error">
                                                    {errors.lastName}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Email</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter email"
                                                value={values.email}
                                                name="email"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled
                                            />
                                            {touched.email && errors.email && (
                                                <FormHelperText error id="email-error">
                                                    {errors.email}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Phone</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Phone"
                                                value={values.phone}
                                                name="phone"
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                disabled={isView}
                                            />
                                            {touched.phone && errors.phone && (
                                                <FormHelperText error id="phone-error">
                                                    {errors.phone}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Status</InputLabel>
                                            <TextField
                                                id="admin-status"
                                                name="status"
                                                select
                                                value={values.status}
                                                fullWidth
                                                onChange={handleChange}
                                                disabled
                                            >
                                                {status.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            {touched.status && errors.status && (
                                                <FormHelperText error id="status-error">
                                                    {errors.status}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <InputLabel>Role</InputLabel>
                                            <TextField
                                                id="admin-role"
                                                name="role"
                                                select
                                                value={values.role}
                                                fullWidth
                                                onChange={handleChange}
                                                disabled
                                            >
                                                {userRole.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            {touched.role && errors.role && (
                                                <FormHelperText error id="role-error">
                                                    {errors.role}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        {!isView && (
                                            <Grid item xs={12}>
                                                <Button
                                                    disabled={isSubmitting}
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    size="large"
                                                >
                                                    Update Profile
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                </form>
                            )}
                        </Formik>
                    </Grid>
                </>
            )}
            <ConfirmModal
                title={'Update Profile'}
                content={'Are you sure you want to update the profile ?'}
                yes={handleSubmitExternally}
                buttonLabelYes={'Yes'}
                buttonLabelNo={'No'}
            />
        </Grid>
    );
};
export default AdminProfileView;
