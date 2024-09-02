'use client';

import Image from 'next/image';

// material-ui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useQuery } from '@apollo/client';
import { GET_ALL_FAQ_QUERY } from './graphql/queries';
import FaqAccordion from 'ui-component/extended/FaqAccordion';
import Loader from 'ui-component/Loader';

// assets
const mailImg = '/assets/images/landing/widget-mail.svg';
const headerBackground = '/assets/images/landing/bg-header.jpg';

// ============================|| SAAS PAGES - FAQs ||============================ //

const Faqs = () => {
  const { data, loading } = useQuery(GET_ALL_FAQ_QUERY, {
    variables: {
      input: {
        limit: 10,
        order: 'asc',
        orderBy: 'section',
        searchText: '',
        skip: 0
      }
    }
  });

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
          <Grid item sm={10} md={7} sx={{ mt: { md: 12.5, xs: 2.5 }, mb: { md: 12.5, xs: 2.5 } }}>
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
                  FAQs
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 400, lineHeight: 1.4, my: { xs: 0, md: 'auto' }, mx: { xs: 12.5, md: 'auto' } }}
                  color="white"
                >
                  Please refer the Frequently ask question for your quick help
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sx={{ position: 'relative', display: { xs: 'none', lg: 'block' } }}>
            <Box
              sx={{
                marginBottom: -0.625,
                position: 'absolute',
                bottom: -90,
                right: '0',
                width: 400,
                maxWidth: '100%',
                animation: '5s wings ease-in-out infinite'
              }}
            >
              <Image src={mailImg} alt="Mail" width={400} height={270} style={{ maxWidth: '100%', height: 'auto' }} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <MainCard sx={{ textAlign: 'left' }} elevation={4} border={false} boxShadow shadow="4">
              {loading ? <Loader /> : <FaqAccordion data={data?.getAllFAQ?.faqs} />}
            </MainCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Faqs;
