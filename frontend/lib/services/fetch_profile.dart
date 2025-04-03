import 'dart:convert';

import 'package:frontend/services/token_service.dart';
import 'package:http/http.dart' as http;

import '../models/fetchProfile.dart';

class ProfileResponse {
  final bool success;
  final String message;
  final ProfileData data;

  ProfileResponse({
    required this.success,
    required this.message,
    required this.data,
  });

  factory ProfileResponse.fromJson(Map<String, dynamic> json) {
    return ProfileResponse(
      success: json['success'],
      message: json['message'],
      data: ProfileData.fromJson(json['data']),
    );
  }
}

class ProfileData {
  final UserProfile user;

  ProfileData({required this.user});

  factory ProfileData.fromJson(Map<String, dynamic> json) {
    return ProfileData(
      user: UserProfile.fromJson(json['user']),
    );
  }
}

class ProfileService {
  static const String baseUrl = 'http://192.168.101.172:4000';
  final TokenService _tokenService = TokenService();

  Future<UserProfile?> fetchUserProfile() async {
    try {
      // Check if token exists
      final token = await _tokenService.getToken();
      if (token == null) {
        print('No authentication token found');
        return null;
      }

      // Prepare headers with token
      final headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      };

      // Make API request
      final response = await http.get(
        Uri.parse('$baseUrl/user/me'),
        headers: headers,
      );

      // Handle response
      if (response.statusCode == 200) {
        final Map<String, dynamic> responseData = json.decode(response.body);
        final profileResponse = ProfileResponse.fromJson(responseData);

        if (profileResponse.success) {
          print('Profile fetched successfully');
          return profileResponse.data.user;
        } else {
          print('Failed to fetch profile: ${profileResponse.message}');
          return null;
        }
      } else if (response.statusCode == 401) {
        // Unauthorized - token might be expired
        print('Unauthorized request. Token might be expired.');
        await _tokenService.deleteToken();
        return null;
      } else {
        print('API error: ${response.statusCode} ${response.body}');
        return null;
      }
    } catch (e) {
      print('Exception while fetching profile: $e');
      return null;
    }
  }

}