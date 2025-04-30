/**
 * Authentication utilities for the micro-frontend
 */

/**
 * Initialize authentication from multiple possible sources
 * Priority: URL params > localStorage > env variables
 */
export const initializeAuth = () => {
  // Get auth from localStorage
  const storedUserId = localStorage.getItem('userId');
  const storedToken = localStorage.getItem('token');
  const storedReturnUrl = localStorage.getItem('returnUrl');
  
  // Get auth from URL params
  const params = new URLSearchParams(window.location.search);
  const urlUserId = params.get('userId');
  const urlToken = params.get('token');
  const urlReturnUrl = params.get('returnUrl');
  
  // Determine final values (URL params take precedence)
  const userId = urlUserId || storedUserId || import.meta.env.VITE_STANDALONE_USER_ID;
  const token = urlToken || storedToken || import.meta.env.VITE_STANDALONE_TOKEN;
  const returnUrl = urlReturnUrl || storedReturnUrl || '/';
  
  // Store in localStorage for persistence
  if (userId) localStorage.setItem('userId', userId);
  if (token) localStorage.setItem('token', token);
  if (returnUrl) localStorage.setItem('returnUrl', returnUrl);
  
  // Also remove from URL if they were there (cleaner URLs)
  if (urlUserId || urlToken || urlReturnUrl) {
    const newParams = new URLSearchParams(window.location.search);
    if (urlUserId) newParams.delete('userId');
    if (urlToken) newParams.delete('token');
    if (urlReturnUrl) newParams.delete('returnUrl');
    
    const newUrl = `${window.location.pathname}${newParams.toString() ? `?${newParams.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }
  
  return { userId, token, returnUrl };
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  // In standalone mode, consider authenticated if either env vars are set
  if (import.meta.env.VITE_RUN_MODE === 'standalone') {
    return Boolean(
      userId || token || import.meta.env.VITE_STANDALONE_USER_ID || import.meta.env.VITE_STANDALONE_TOKEN
    );
  }
  
  // In normal mode, require both userId and token
  return Boolean(userId && token);
};

/**
 * Return to parent application
 */
export const returnToParentApp = () => {
  const returnUrl = localStorage.getItem('returnUrl') || '/';
  window.location.href = returnUrl;
};

/**
 * Get the language ISO code from a language name
 * This is a helper utility that can be used when we know the language name
 * but need the ISO code for API calls
 */
export const getLanguageIsoCode = (languageName) => {
  // Common language mappings
  const languageMappings = {
    'english': 'en',
    'french': 'fr',
    'spanish': 'es',
    'german': 'de',
    'italian': 'it',
    'portuguese': 'pt',
    'russian': 'ru',
    'japanese': 'ja',
    'chinese': 'zh',
    'arabic': 'ar',
    'hindi': 'hi',
    'bengali': 'bn',
    'turkish': 'tr',
    // Add more as needed
  };
  
  // Try to find a direct match
  const normalizedName = languageName.toLowerCase().trim();
  if (languageMappings[normalizedName]) {
    return languageMappings[normalizedName];
  }
  
  // If it's already a 2-letter code, return it
  if (/^[a-z]{2}$/.test(normalizedName)) {
    return normalizedName;
  }
  
  // For unknown languages, return null (the API will need to determine it)
  return null;
}; 