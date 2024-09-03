import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const useSuccErrSnack = () => {
  const dispatch = useDispatch();

  const successSnack = (message: string) => {
    dispatch(
      openSnackbar({
        open: true,
        message,
        variant: 'alert',
        alert: {
          color: 'success'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        close: false
      })
    );
  };

  const errorSnack = (message: string) => {
    dispatch(
      openSnackbar({
        open: true,
        message,
        variant: 'alert',
        alert: {
          color: 'error'
        },
        anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
        close: false
      })
    );
  };

  return { successSnack, errorSnack };
};

export default useSuccErrSnack;
