'use client';
// material-ui
import Typography from '@mui/material/Typography';
import CustomTimeRangePicker from 'components/timerangepicker/CustomtimeRangePicker';
import { Formik } from 'formik';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const ClientList = () => {
  const handleSubmitForm = () => {};
  return (
    <MainCard title="Client List">
      <Typography variant="h5">Time range picker</Typography>
      <Formik
        enableReinitialize
        initialValues={{
          startTime: '',
          endTime: ''
        }}
        validationSchema={''}
        onSubmit={handleSubmitForm}
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setValues }) => {
          return (
            <form onSubmit={handleSubmit}>
              <CustomTimeRangePicker
                startTime={values.startTime}
                endTime={values.endTime}
                onChangeStartTime={(date: any) => setFieldValue('startTime', date)}
                onChangeEndTime={(date: any) => setFieldValue('endTime', date)}
                errorStartTime={touched.startTime && errors.startTime ? errors.startTime : ''}
                errorEndTime={touched.endTime && errors.endTime ? errors.endTime : ''}
                timeIntervals={60}
              />
            </form>
          );
        }}
      </Formik>
    </MainCard>
  );
};

export default ClientList;
