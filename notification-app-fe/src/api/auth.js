import axios from 'axios';
import { Log, setLogToken } from '../../../logging-middleware/index.js';

const AUTH_URL = 'http://4.224.186.213/evaluation-service/auth';

export const loginAndGetToken = async () => {
  // IMPORTANT: Since the last 4 characters of the clientSecret were not provided, 
  // you MUST replace 'REPLACE_ME' with the actual 4 characters for this to work.
  const payload = {
    clientID: "1b0b7cdd-2627-439b-a8bc-34e3313b77e8",
    clientSecret: "eHmzQGWpmBRCREPLACE_ME", 
    name: "Vishal Vashistha",
    email: "vishal.vashistha2023@glbajajgroup.org",
    rollNo: "2305111520064",
    accessCode: "xxkJnk"
  };

  try {
    const response = await axios.post(AUTH_URL, payload);
    const token = response.data.token;
    
    // Set token for logging middleware
    if (token) {
      setLogToken(token);
      localStorage.setItem('bearerToken', token);
      Log('frontend', 'info', 'api', 'Successfully authenticated and retrieved token.');
    }
    return token;
  } catch (error) {
    // Silently fail as per requirements (no console.log)
    return null;
  }
};
