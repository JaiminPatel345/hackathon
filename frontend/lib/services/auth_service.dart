// services/api_provider.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
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
    print('register');
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(user.toJson()),
      );
      final responseData = jsonDecode(response.body);
      print("Response status code: ${response.statusCode}");
      print("Response body: ${response.body}"); // Add this line

      return ApiResponse(
        success: response.statusCode == 201 || response.statusCode == 200,
        message: responseData['message'] ?? 'Registration successful',
        data: responseData['data'],
      );
    } catch (e) {
      print("Error: ${e.toString()}"); // Add this line
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
  Future<ApiResponse> verifyOtp(String username, String otp) async {
    print('username : $username');
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/auth/verify-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'username': username,
          'givenOtp': otp,
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

