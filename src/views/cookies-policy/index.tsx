'use client';

// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
const headerBackground = '/assets/images/landing/bg-header.jpg';

// ============================|| SAAS PAGES - PRIVCY POLICY ||============================ //

const CookiesPolicy = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: '100% 600px',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        textAlign: 'center',
        pt: { xs: 0, md: 3.75 }
      }}
    >
      <Container>
        <Grid container justifyContent="center" spacing={gridSpacing}>
          <Grid item sm={10} md={7} sx={{ mt: { md: 12.5, xs: 2.5 }, mb: { md: 8, xs: 2.5 } }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <Typography
                  variant="h1"
                  color="white"
                  sx={{
                    fontSize: { xs: '1.8125rem', md: '3.5rem' },
                    fontWeight: 900,
                    lineHeight: 1.4,
                    mt: { xs: 10, md: 'auto' }
                  }}
                >
                  Cookies Policy
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 400, lineHeight: 1.4, my: { xs: 0, md: 'auto' }, mx: { xs: 12.5, md: 'auto' } }}
                  color="white"
                >
                  Last updated on 18th Feb 2022
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <MainCard elevation={4} border={false} boxShadow shadow={4} sx={{ mb: 3 }}>
              <Stack spacing={2} sx={{ textAlign: 'left' }}>
                <Typography>
                  This Cookies Policy governs the manner in which Demos: A Network for Ideas and Action, Ltd. (“Demos”, “Us” or “We”)
                  collects, uses, maintains, and discloses information collected from users (“Users” or “You”) of its website located at{' '}
                  <Link href="#" underline="none">
                    www.demos.org
                  </Link>{' '}
                  (the “Website”).
                </Typography>
                <Typography variant="h3">The Types of Information Demos Collect</Typography>
                <ul>
                  <li>
                    <Typography variant="h5">Non-personally identifiable information</Typography>
                  </li>
                </ul>
                <Typography>
                  Demos may collect non-personally identifiable information about you whenever you visit the Website. Such information may
                  include the Internet Protocol (IP) address of the computer you used, the type of browser and operating system you used,
                  the date and time you visited the Website, the Internet address of the site from which you linked to the Website, and
                  which pages you viewed on the Website.
                </Typography>
                <ul>
                  <li>
                    <Typography variant="h5">Web browser cookies</Typography>
                  </li>
                </ul>
                <Typography>
                  Demos may use “cookies” to enhance your experience with the Website. A cookie is a small text file that is stored in your
                  computer so that the Website can recognize you and keep track of your preferences. Use of cookies help to measure
                  aggregate web statistics, such as collecting the number of Users to the Website, the number of repeat Users and the most
                  popular webpages, to serve relevant content to a User as he/she browses the Internet, and for other purposes. You may
                  choose to set your web browser to refuse cookies, or to alert you when cookies are being sent. If you do so, however, some
                  parts of the Website may not function properly.
                </Typography>
              </Stack>
            </MainCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CookiesPolicy;
