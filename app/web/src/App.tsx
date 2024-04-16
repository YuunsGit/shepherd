import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { ShepherdJourneyProvider } from 'react-shepherd';

import { FatalErrorBoundary, RedwoodProvider } from '@redwoodjs/web';
import { RedwoodApolloProvider } from '@redwoodjs/web/apollo';

import FatalErrorPage from 'src/pages/FatalErrorPage';
import Routes from 'src/Routes';

import { AuthProvider, useAuth } from './auth';

import './scaffold.css';
import './index.css';

if (process.env.POSTHOG_API_KEY && typeof window !== 'undefined') {
  posthog.init(process.env.POSTHOG_API_KEY, {
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}

const App = () => (
  <FatalErrorBoundary page={FatalErrorPage}>
    <RedwoodProvider titleTemplate="%PageTitle | %AppTitle">
      <AuthProvider>
        <RedwoodApolloProvider
          graphQLClientConfig={{
            connectToDevTools:
              process.env.NODE_ENV === 'development' ? true : false,
            queryDeduplication: true,
          }}
          useAuth={useAuth}
        >
          <PostHogProvider client={posthog}>
            <ShepherdJourneyProvider apiKey={process.env.SHEPHERD_PUBLIC_KEY}>
              <Routes />
            </ShepherdJourneyProvider>
          </PostHogProvider>
        </RedwoodApolloProvider>
      </AuthProvider>
    </RedwoodProvider>
  </FatalErrorBoundary>
);

export default App;