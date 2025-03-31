// lib/services/auth_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';

class AuthService {
  final String baseUrl = 'http://192.168.143.167:4000';
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      // Implementation for real API calls when ready
      final response = await http.get(Uri.parse('$baseUrl/$endpoint'));

      if (response.statusCode == 200) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load data: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('API Error: $e');
    }
  }

  Future<ApiResponse<void>> updateUser(UserModel user) async {
    try {
      final token = await getToken();
      if (token == null) {
        return ApiResponse(
          success: false,
          message: 'Unauthorized: No token found',
        );
      }

      final response = await http.put(
        Uri.parse('$baseUrl/users/update'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(user.toJson()),
      );

      final responseData = jsonDecode(response.body);

      return ApiResponse(
        success: response.statusCode == 200,
        message: responseData['message'] ?? 'Update failed',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }
  // Register a new user
  Future<ApiResponse<void>> register(UserModel user) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(user.toJson()),
      );

      final responseData = jsonDecode(response.body);
      return ApiResponse(
        success: response.statusCode == 201,
        message: responseData['message'] ?? 'Registration failed',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  // Send OTP for verification
  Future<ApiResponse<void>> sendOtp(String mobile) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/send-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'mobile': mobile}),
      );

      final responseData = jsonDecode(response.body);
      return ApiResponse(
        success: response.statusCode == 200,
        message: responseData['message'] ?? 'Failed to send OTP',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  // Verify OTP
  Future<ApiResponse<AuthResponse>> verifyOtp(String username, String otp) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'givenOtp': otp,
        }),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200 && responseData['success']) {
        final authResponse = AuthResponse.fromJson(responseData['data']);

        // Save token and user info
        await _storage.write(key: 'auth_token', value: authResponse.token);
        await _storage.write(key: 'user_data', value: jsonEncode(responseData['data']['user']));

        return ApiResponse(
          success: true,
          message: responseData['message'] ?? 'OTP verified successfully',
          data: authResponse,
        );
      }

      return ApiResponse(
        success: false,
        message: responseData['message'] ?? 'OTP verification failed',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  // Login user
  Future<ApiResponse<AuthResponse>> login(String identifier, String password) async {
    try {
      final loginRequest = LoginRequest(
        identifier: identifier,
        password: password,
      );

      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(loginRequest.toJson()),
      );

      final responseData = jsonDecode(response.body);

      if (response.statusCode == 200 && responseData['success']) {
        final authResponse = AuthResponse.fromJson(responseData['data']);

        // Save token and user info
        await _storage.write(key: 'auth_token', value: authResponse.token);
        await _storage.write(key: 'user_data', value: jsonEncode(responseData['data']['user']));

        return ApiResponse(
          success: true,
          message: responseData['message'] ?? 'Login successful',
          data: authResponse,
        );
      }

      return ApiResponse(
        success: false,
        message: responseData['message'] ?? 'Login failed',
      );
    } catch (e) {
      return ApiResponse(
        success: false,
        message: 'Network error: ${e.toString()}',
      );
    }
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    final token = await _storage.read(key: 'auth_token');
    return token != null;
  }

  // Get current user
  Future<UserModel?> getCurrentUser() async {
    final userData = await _storage.read(key: 'user_data');
    if (userData != null) {
      return UserModel.fromJson(jsonDecode(userData));
    }
    return null;
  }

  // Logout
  Future<void> logout() async {
    await _storage.delete(key: 'auth_token');
    await _storage.delete(key: 'user_data');
  }

  // Get token
  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }
}