'use client';

import { ReactNode } from 'react';

// third-party
import { Provider } from 'react-redux';

// project-import
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import Snackbar from 'ui-component/extended/Snackbar';

import ThemeCustomization from 'themes';

import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';

import client from '../../apollo.config';
import { ApolloProvider } from '@apollo/client';
import { SessionProvider } from 'next-auth/react';

// import { JWTProvider as AuthProvider } from 'contexts/JWTContext';

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ApolloProvider client={client}>
        <ConfigProvider>
          <ThemeCustomization>
            <Locales>
              <NavigationScroll>
                <SessionProvider>
                  <>
                    <Snackbar />
                    {children}
                  </>
                </SessionProvider>
              </NavigationScroll>
            </Locales>
          </ThemeCustomization>
        </ConfigProvider>
      </ApolloProvider>
    </Provider>
  );
}
