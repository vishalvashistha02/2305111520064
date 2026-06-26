import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  AppBar, Toolbar, Typography, Button, Container, Box, CircularProgress, Alert
} from '@mui/material';
import AllNotifications from './pages/AllNotifications';
import PriorityInbox from './pages/PriorityInbox';
import { loginAndGetToken } from './api/auth';
import { Log } from '../../logging-middleware';

// Premium Material UI Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2563eb' },
    secondary: { main: '#7c3aed' },
    success: { main: '#059669' },
    background: { default: '#f8fafc', paper: '#ffffff' }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h6: { fontWeight: 600 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }
      }
    }
  }
});

function App() {
  const [token, setToken] = useState(localStorage.getItem('bearerToken'));
  const [loading, setLoading] = useState(!token);
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticate = async () => {
      if (!token) {
        Log('frontend', 'info', 'component', 'App initializing, requesting auth token');
        const newToken = await loginAndGetToken();
        if (newToken) {
          setToken(newToken);
          setLoading(false);
        } else {
          setError('Failed to authenticate. Please check if your clientSecret is properly configured in auth.js.');
          setLoading(false);
        }
      }
    };
    authenticate();
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', color: 'text.primary' }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
                Campus Connect
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="inherit" component={Link} to="/">All Notifications</Button>
                <Button variant="contained" color="primary" component={Link} to="/priority" disableElevation>
                  Priority Inbox
                </Button>
              </Box>
            </Toolbar>
          </AppBar>
          
          <Box sx={{ flexGrow: 1, py: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Container maxWidth="md">
                <Alert severity="error">{error}</Alert>
              </Container>
            ) : (
              <Routes>
                <Route path="/" element={<AllNotifications token={token} />} />
                <Route path="/priority" element={<PriorityInbox token={token} />} />
              </Routes>
            )}
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;