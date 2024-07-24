// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { Divider } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="flex-end" spacing={1}>
    <Stack direction="row" spacing={1}>
      <Typography variant="subtitle2" component={Link} href="/pages/privacy-policy" underline="hover">
        Privacy Policy
      </Typography>
      <Divider orientation="vertical" />
      <Typography variant="subtitle2" component={Link} href="/pages/terms-conditions" underline="hover">
        Terms and condition
      </Typography>
    </Stack>
    <Typography variant="subtitle2" component={Link} href="/home/" underline="hover">
      &copy; Ebtheme
    </Typography>
  </Stack>
);

export default AuthFooter;
