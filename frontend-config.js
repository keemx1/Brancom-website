// Frontend Configuration
// Update these values for production deployment

const config = {
  // Development
  development: {
    apiUrl: 'http://localhost:5000',
    environment: 'development'
  },
  
  // Production - Update this with your actual backend URL
  production: {
    apiUrl: 'https://your-app.railway.app', // Replace with your Railway backend URL
    environment: 'production'
  }
};

// Auto-detect environment
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
const currentConfig = isProduction ? config.production : config.development;

// Export configuration
window.APP_CONFIG = currentConfig;

// Helper function to get API URL
window.getApiUrl = (endpoint) => {
  return `${currentConfig.apiUrl}${endpoint}`;
};

// Log configuration (remove in production)
console.log('App Configuration:', currentConfig);

export default currentConfig;
