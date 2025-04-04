import { Alert } from 'react-native';

/**
 * CSS Parser Error Handler
 * Patches the error with aspect-ratio in react-native-css-interop
 */
export const handleCSSParserError = (error: any) => {
  // Check if it's the specific aspect-ratio error
  if (
    error instanceof TypeError &&
    error.message.includes("Cannot read properties of undefined (reading '0')") &&
    error.stack?.includes('parseAspectRatio')
  ) {
    console.warn(
      'CSS Parsing Error: There appears to be an issue with the aspect-ratio property. ' +
      'Please check your CSS for proper aspect-ratio format or remove aspect-ratio properties.'
    );
    
    // You can display an alert to the user if needed
    // Alert.alert('CSS Parsing Error', 'There is an issue with aspect-ratio styling.');
    
    return true; // Error was handled
  }
  
  return false; // Error was not handled
};

/**
 * Global error boundary function
 */
export const setupGlobalErrorHandler = () => {
  const originalErrorHandler = ErrorUtils.getGlobalHandler();
  
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Try to handle known errors
    const wasHandled = handleCSSParserError(error);
    
    // If not handled, pass to the original handler
    if (!wasHandled) {
      originalErrorHandler(error, isFatal);
    }
  });
}; 