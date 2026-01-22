import { BrowserRouter as Router } from 'react-router-dom';
import { AppProviders } from './app/providers';
import { AppRouter } from './app/router/AppRouter';

function App() {
  return (
    <AppProviders>
      <Router>
        <AppRouter />
      </Router>
    </AppProviders>
  );
}

export default App;