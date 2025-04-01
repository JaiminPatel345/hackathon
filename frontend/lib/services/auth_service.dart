// services/api_provider.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';

class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
  });
}

class ApiProvider {
  final String _baseUrl = 'http://192.168.101.172:4000';

  // Register user
  Future<ApiResponse> registerUser(UserModel user) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(user.toJson()),
      );

      final responseData = jsonDecode(response.body);

      return ApiResponse(
        success: response.statusCode == 201,
        message: responseData['message'] ?? 'Registration successful',
        data: responseData['data'],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  // Login user
  Future<ApiResponse> loginUser(String identifier, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'identifier': identifier,
          'password': password,
        }),
      );

      final responseData = jsonDecode(response.body);

      return ApiResponse(
        success: response.statusCode == 200,
        message: responseData['message'] ?? 'Login successful',
        data: responseData['data'],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }
  Future<bool> hasToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    return token != null && token.isNotEmpty;
  }
  static const String _tokenKey = 'auth_token';
  // Get the stored token
  Future<String> getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString(_tokenKey);

      if (token == null || token.isEmpty) {
        throw Exception('Token not found');
      }

      return token;
    } catch (e) {
      print('Error retrieving token: $e');
      throw Exception('Failed to get authentication token');
    }
  }

  // Save a new token
  Future<bool> saveToken(String token) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.setString(_tokenKey, token);
    } catch (e) {
      print('Error saving token: $e');
      return false;
    }
  }

  // Clear the stored token (for logout or token expiration)
  Future<bool> clearToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return await prefs.remove(_tokenKey);
    } catch (e) {
      print('Error clearing token: $e');
      return false;
    }
  }

  // Validate token format (basic validation)
  bool isValidTokenFormat(String token) {
    // Basic check - you might want to implement more sophisticated validation
    // such as checking JWT structure or expiration
    return token.isNotEmpty && token.contains('.');
  }

  // Refresh token if necessary (placeholder - implement based on your auth system)
  Future<String> refreshTokenIfNeeded() async {
    // This is a placeholder for token refresh logic
    // Implement according to your authentication system's requirements

    try {
      // Check if current token exists
      if (!await hasToken()) {
        throw Exception('No token to refresh');
      }

      final currentToken = await getToken();

      // Here you would typically call your auth server to refresh the token
      // For demo purposes, we'll just return the current token
      return currentToken;

      // In a real implementation:
      // final response = await dio.post('/auth/refresh', data: {'token': currentToken});
      // final newToken = response.data['token'];
      // await saveToken(newToken);
      // return newToken;
    } catch (e) {
      print('Error refreshing token: $e');
      throw Exception('Failed to refresh authentication token');
    }
  }
  // Send OTP
  Future<ApiResponse> sendOtp(String mobileNumber) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'mobile': mobileNumber}),
      );

      final responseData = jsonDecode(response.body);

      return ApiResponse(
        success: response.statusCode == 200,
        message: responseData['message'] ?? 'OTP sent successfully',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  // Verify OTP
  Future<ApiResponse> verifyOtp(String mobileNumber, String otp) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'mobile': mobileNumber,
          'otp': otp,
        }),
      );

      final responseData = jsonDecode(response.body);

      return ApiResponse(
        success: response.statusCode == 200,
        message: responseData['message'] ?? 'OTP verified successfully',
        data: responseData['data'],
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }
}

