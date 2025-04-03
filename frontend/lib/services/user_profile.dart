// lib/services/user_profile_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/fetchProfile.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserProfileService {
  final String baseUrl = 'http://192.168.101.172:4000';
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();

  Future<UserProfile?> fetchUserProfileById(String userId) async {
    try {
      final userId = '67ee253df8af66ed55babc72';

      print('Fetching profile for user ID: $userId');
      final response = await http.get(
        Uri.parse('$baseUrl/user/profile/$userId'),
        headers: {'Content-Type': 'application/json'},
      );

      print('Full response body: ${response.body}'); // Debugging step

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        final userData = responseData['data']?['user'];

        if (userData == null) {
          print('User data is null!'); // Debugging
          return null;
        }
        print("last print");
        print(UserProfile.fromJson(userData));
        print("last print 2");

        return UserProfile.fromJson(userData);
      } else {
        print('Failed to load profile: ${response.statusCode}');
        return null;
      }
    } catch (e) {
      print('Error fetching profile: $e');
      return null;
    }
  }

  // For fetching the current user's profile
  Future<UserProfile?> fetchCurrentUserProfile() async {
    try {
      print('Fetching current user profile...');
      final Map<String, String> allKeys = await _secureStorage.readAll();
      print(allKeys);
      // Retrieve the current user ID from secure storage
      final String? currentUserId = await _secureStorage.read(key: 'auth_token');

      if (currentUserId == null || currentUserId.isEmpty) {
        print('No user ID found in secure storage');
        return null;
      }
      print('user id: $currentUserId');
      return await fetchUserProfileById(currentUserId);
    } catch (e) {
      print('Error in fetchCurrentUserProfile: $e');
      return null;
    }
  }
}