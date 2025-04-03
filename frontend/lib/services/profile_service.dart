import 'dart:io';
import 'package:dio/dio.dart';
import 'package:cloudinary_public/cloudinary_public.dart';
import 'package:frontend/services/token_service.dart';
import '../models/profile_model.dart';

class ProfileService {
  // Singleton pattern
  static final ProfileService _instance = ProfileService._internal();

  factory ProfileService() => _instance;

  ProfileService._internal();

  // Dio for HTTP requests with better error handling
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://192.168.101.172:4000',
    validateStatus: (status) {
      return status! < 500; // Don't throw on 4xx errors so we can handle them
    },
  ));

  // Cloudinary configuration
  // Make sure the second parameter matches an existing upload preset
  final CloudinaryPublic cloudinary = CloudinaryPublic(
      'dm4xqk12g', 'ml_default', cache: false);

  // API Provider instance
  final TokenService _tokenService = TokenService();

  // Check authentication before operations
  Future<String> _ensureAuthenticated() async {
    try {
      // Check if we have a token
      final hasToken = await _tokenService.hasToken();
      print('Has token check result: $hasToken');

      if (!hasToken) {
        print('No token found in storage');
        throw Exception('Not authenticated. Please login first.');
      }

      // Get the token
      final token = await _tokenService.getToken();
      print('Retrieved token length: ${token?.length}');

      if (token!.isEmpty) {
        print('Token is empty');
        throw Exception('Invalid token. Please login again.');
      }

      return token;
    } catch (e) {
      print('Authentication error details: $e');
      // Only clear token if it's an authentication-specific error
      if (e.toString().contains('Invalid token') ||
          e.toString().contains('expired')) {
        await _tokenService.deleteToken();
      }
      throw Exception('Authentication failed: $e');
    }
  }

  // Update profile data
  // Inside your ProfileService class

// Example method for uploading profile
  Future<bool> updateProfile(Profile profile, String userId) async {
    try {
      // Get token and inspect it
      final token = await _tokenService.getToken();
      if (token == null || token.isEmpty) {
        throw Exception('Not authenticated. Please login first.');
      }

      print('Token first/last 10 chars: ${token.substring(0, 10)}...${token.substring(token.length - 10)}');

      // Try different authorization header formats
      final headers = {
        'Content-Type': 'application/json',
      };

      // Try without touching the baseUrl
      final fullUrl = '${_dio.options.baseUrl}/user/update-profile';
      print('Sending request to: $fullUrl');

      // Try all these options one by one:

      // Option 1: With Bearer prefix (standard)
      headers['Authorization'] = 'Bearer $token';

      // If option 1 fails, try these alternatives:
      // headers['Authorization'] = token; // Option 2: Without Bearer prefix
      // headers['x-auth-token'] = token;  // Option 3: Different header name

      final response = await _dio.put(
        '/user/update-profile',
        options: Options(headers: headers),
        data: profile.toJson(),
      );

      print('Response status: ${response.statusCode}');
      print('Response data: ${response.data}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else if (response.statusCode == 401) {
        await _tokenService.deleteToken();
        throw Exception('Your session has expired. Please login again.');
      } else {
        throw Exception('Failed to update profile: ${response.data}');
      }
    } catch (e) {
      print('Error in updateProfile: $e');
      rethrow;
    }
  }

  // Upload profile image to Cloudinary
  // Replace your current uploadProfileImage method with this fixed version
  // Replace your current uploadProfileImage method with this fixed version
  Future<String> uploadProfileImage(File imageFile) async {
    print('Starting image upload to Cloudinary...');
    try {
      // Validate file existence
      if (!await imageFile.exists()) {
        throw Exception('Image file does not exist');
      }

      // Check file size
      final fileSize = await imageFile.length();
      print('Image file size: ${(fileSize / 1024).toStringAsFixed(2)} KB');
      if (fileSize > 5 * 1024 * 1024) {
        throw Exception('Image size exceeds 5MB limit');
      }

      print('Uploading to Cloudinary with path: ${imageFile.path}');

      // Use Dio directly to upload to Cloudinary with proper upload preset
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(
          imageFile.path,
          filename: imageFile.path
              .split('/')
              .last,
        ),
        'upload_preset': 'makemybuddy',
        // Make sure this preset exists in your Cloudinary account
        'cloud_name': 'dm4xqk12g',
      });

      final response = await Dio().post(
        'https://api.cloudinary.com/v1_1/dm4xqk12g/image/upload',
        data: formData,
      );

      if (response.statusCode == 200) {
        final secureUrl = response.data['secure_url'];
        print('Upload successful. Secure URL: $secureUrl');
        return secureUrl;
      } else {
        throw Exception('Failed to upload image: ${response.statusCode}');
      }
    } on DioException catch (e) {
      print('Network error uploading to Cloudinary: ${e.message}');
      if (e.response != null) {
        print('Response data: ${e.response?.data}');
      }
      throw Exception('Network error during upload: ${e.message}');
    } catch (e) {
      print('Unexpected error uploading image: $e');
      throw Exception('Failed to upload image: $e');
    }
  }

  // Get profile data
  Future<Profile> getProfile(String userId) async {
    try {
      // Ensure authenticated and get token
      final token = await _ensureAuthenticated();

      if (userId.isEmpty) {
        throw Exception('User ID cannot be empty');
      }

      final response = await _dio.get(
        '/user/update-profile',
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      );

      if (response.statusCode == 200) {
        return Profile.fromJson(response.data['profile']);
      } else if (response.statusCode == 404) {
        throw Exception('Profile not found');
      } else if (response.statusCode == 401) {
        await _tokenService.deleteToken();
        throw Exception('Session expired. Please login again.');
      } else {
        throw Exception('Failed to get profile: ${response.statusCode}');
      }
    } on DioException {
      rethrow;
    } catch (e) {
      print('Unexpected error in getProfile: $e');
      rethrow;
    }
  }
}