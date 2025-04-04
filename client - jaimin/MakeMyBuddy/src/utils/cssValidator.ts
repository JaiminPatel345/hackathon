import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

/**
 * Scans CSS files for problematic aspect-ratio properties
 * @param {string} cssFilePath - Path to CSS file
 * @returns {Promise<boolean>} - Returns true if issues found
 */
export const scanForAspectRatioIssues = async (cssFilePath: string): Promise<boolean> => {
  try {
    // Read the file content
    const fileContent = await FileSystem.readAsStringAsync(cssFilePath);
    
    // Simple regex to detect aspect-ratio property
    const aspectRatioRegex = /aspect-ratio\s*:/gi;
    const matches = fileContent.match(aspectRatioRegex);
    
    if (matches && matches.length > 0) {
      console.warn(
        `CSS Validation Warning: Found ${matches.length} instances of aspect-ratio in ${cssFilePath}. ` +
        `This property may cause parsing errors with react-native-css-interop.`
      );
      
      return true; // Issues found
    }
    
    return false; // No issues found
    
  } catch (error) {
    console.error('Error scanning CSS file:', error);
    return false;
  }
};

/**
 * Suggests fixes for CSS files with aspect-ratio issues
 * @param {string} cssFilePath - Path to CSS file with issues
 */
export const suggestFixes = async (cssFilePath: string): Promise<void> => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(cssFilePath);
    
    // Replace aspect-ratio with safer alternatives
    const fixedContent = fileContent.replace(
      /aspect-ratio\s*:\s*(\d+)\s*\/\s*(\d+)\s*;/gi,
      (match, width, height) => {
        const ratio = (parseInt(height) / parseInt(width)) * 100;
        return `/* ${match} - Replaced to fix parser error */\n  width: 100%;\n  height: 0;\n  padding-bottom: ${ratio}%;`;
      }
    );
    
    if (fixedContent !== fileContent) {
      // Create a backup of the original file
      await FileSystem.copyAsync({
        from: cssFilePath,
        to: `${cssFilePath}.backup`
      });
      
      // Write the fixed content
      await FileSystem.writeAsStringAsync(cssFilePath, fixedContent);
      
      console.log(`Fixed aspect-ratio issues in ${cssFilePath}. Backup saved as ${cssFilePath}.backup`);
      
      Alert.alert(
        'CSS Files Fixed',
        `Fixed aspect-ratio issues in ${cssFilePath}. A backup of the original file has been created.`,
        [{ text: 'OK' }]
      );
    }
  } catch (error) {
    console.error('Error fixing CSS file:', error);
  }
}; 