import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, CardContent, Chip, Container, List, ListItem, Divider, Avatar
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { format } from 'date-fns';
import { getNotifications } from '../api/notifications';
import { getTopNotifications } from '../utils/PriorityQueue';
import { Log } from '../../../logging-middleware';

const PriorityInbox = ({ token }) => {
  const [topNotifications, setTopNotifications] = useState([]);

  useEffect(() => {
    const fetchAndSortNotifs = async () => {
      Log('frontend', 'info', 'page', 'Fetching notifications for Priority Inbox page');
      if (token) {
        const data = await getNotifications(token);
        const top10 = getTopNotifications(data || [], 10);
        setTopNotifications(top10);
        Log('frontend', 'info', 'page', `Priority Inbox sorted and displayed top ${top10.length} notifications`);
      }
    };
    fetchAndSortNotifs();
  }, [token]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Avatar sx={{ bgcolor: 'primary.main' }}>
          <NotificationsActiveIcon />
        </Avatar>
        <Typography variant="h4" fontWeight="bold">Priority Inbox</Typography>
      </Box>
      <Typography variant="subtitle1" color="text.secondary" mb={4}>
        Your top 10 most important and recent updates.
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        {topNotifications.length === 0 ? (
          <Typography p={3} align="center" color="text.secondary">No high priority notifications found.</Typography>
        ) : (
          topNotifications.map((notif, idx) => (
            <React.Fragment key={notif.id || idx}>
              <ListItem 
                alignItems="flex-start" 
                sx={{ 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: idx < 3 ? 'rgba(25, 118, 210, 0.04)' : 'transparent' 
                }}
              >
                <Box display="flex" justifyContent="space-between" width="100%" mb={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={`#${idx + 1}`} 
                      size="small" 
                      color="secondary" 
                      variant={idx < 3 ? 'filled' : 'outlined'}
                      sx={{ height: 20, fontSize: '0.7rem', fontWeight: 'bold' }} 
                    />
                    <Typography variant="h6" fontWeight="bold" color="text.primary">
                      {notif.title || 'Notification'}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {notif.createdAt ? format(new Date(notif.createdAt), 'PPpp') : ''}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  {notif.message}
                </Typography>
                <Chip 
                  label={notif.type?.toUpperCase() || 'UNKNOWN'} 
                  size="small" 
                  color={notif.type?.toLowerCase() === 'placement' ? 'primary' : notif.type?.toLowerCase() === 'result' ? 'success' : 'default'}
                />
              </ListItem>
              {idx < topNotifications.length - 1 && <Divider component="li" />}
            </React.Fragment>
          ))
        )}
      </List>
    </Container>
  );
};

export default PriorityInbox;
