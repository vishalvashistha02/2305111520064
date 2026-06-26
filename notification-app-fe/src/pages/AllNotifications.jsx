import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Chip, MenuItem, Select, FormControl, InputLabel, 
  Container, List, ListItem, Divider
} from '@mui/material';
import { format } from 'date-fns';
import { getNotifications } from '../api/notifications';
import { Log } from '../../../logging-middleware';

const AllNotifications = ({ token }) => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const fetchNotifs = async () => {
      Log('frontend', 'info', 'page', 'Fetching notifications for AllNotifications page');
      if (token) {
        const data = await getNotifications(token);
        setNotifications(data || []);
      }
    };
    fetchNotifs();
  }, [token]);

  const filtered = notifications.filter(n => filterType === 'all' || n.type?.toLowerCase() === filterType);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">All Notifications</Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={filterType}
            label="Filter by Type"
            onChange={(e) => {
              setFilterType(e.target.value);
              Log('frontend', 'info', 'page', `Filter changed to ${e.target.value}`);
            }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="placement">Placement</MenuItem>
            <MenuItem value="result">Result</MenuItem>
            <MenuItem value="event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {filtered.length === 0 ? (
          <Typography p={3} align="center" color="text.secondary">No notifications found.</Typography>
        ) : (
          filtered.map((notif, idx) => (
            <React.Fragment key={notif.id || idx}>
              <ListItem alignItems="flex-start" sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {!notif.viewed && (
                      <Chip label="NEW" color="error" size="small" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} />
                    )}
                    <Typography variant="subtitle1" fontWeight={!notif.viewed ? 'bold' : 'normal'}>
                      {notif.title || 'Notification'}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {notif.createdAt ? format(new Date(notif.createdAt), 'PPpp') : ''}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  {notif.message}
                </Typography>
                <Chip 
                  label={notif.type?.toUpperCase() || 'UNKNOWN'} 
                  size="small" 
                  color={notif.type?.toLowerCase() === 'placement' ? 'primary' : notif.type?.toLowerCase() === 'result' ? 'success' : 'default'}
                  sx={{ mt: 1 }}
                />
              </ListItem>
              {idx < filtered.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        )}
      </List>
    </Container>
  );
};

export default AllNotifications;
