import axios from 'axios';
import { Log } from '../../../logging-middleware/index.js';

const NOTIFICATIONS_URL = 'http://4.224.186.213/evaluation-service/notifications';

export const getNotifications = async (token) => {
  try {
    const response = await axios.get(NOTIFICATIONS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    Log('frontend', 'info', 'api', `Successfully fetched ${response.data?.length || 0} notifications.`);
    return response.data || [];
  } catch (error) {
    Log('frontend', 'error', 'api', `Failed to fetch notifications: ${error.message}`);
    return [];
  }
};
