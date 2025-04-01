import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:cloudinary_public/cloudinary_public.dart';
import '../models/profile_model.dart';
import '../providers/profile_provider.dart';
import 'auth_service.dart';

class ProfileService {
  // Singleton pattern
  static final ProfileService _instance = ProfileService._internal();
  factory ProfileService() => _instance;
  ProfileService._internal();

  // Dio for HTTP requests with better error handling
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://192.168.101.172:4000',
    connectTimeout: const Duration(seconds: 15),  // Increased timeout
    receiveTimeout: const Duration(seconds: 15),
    validateStatus: (status) {
      return status! < 500; // Don't throw on 4xx errors so we can handle them
    },
  ));

  // Cloudinary configuration
  final CloudinaryPublic cloudinary = CloudinaryPublic('dm4xqk12g', 'makemybuddy/', cache: false);

  // API Provider instance
  final ApiProvider _apiProvider = ApiProvider();

  // Check authentication before operations
  Future<String> _ensureAuthenticated() async {
    if (!await _apiProvider.hasToken()) {
      throw Exception('Not authenticated. Please login first.');
    }

    try {
      final token = await _apiProvider.getToken();
      if (token.isEmpty) {
        throw Exception('Invalid token. Please login again.');
      }
      return token;
    } catch (e) {
      print('Authentication error: $e');
      await _apiProvider.clearToken(); // Clear invalid token
      throw Exception('Authentication failed: $e');
    }
  }

  // Update profile data
  Future<bool> updateProfile(Profile profile, File? imageFile, String userId) async {
    try {
      // Ensure authenticated and get token
      final token = await _ensureAuthenticated();

      // Validate userId
      if (userId.isEmpty) {
        throw Exception('User ID cannot be empty');
      }

      // Upload image if provided
      if (imageFile != null) {
        try {
          final imageUrl = await uploadProfileImage(imageFile);
          profile.avatar = imageUrl;
        } catch (e) {
          print('Image upload failed, proceeding without: $e');
          // We continue without a new image rather than failing the whole update
        }
      }

      // Debug print the full URL and data
      print('Attempting to update profile at: ${_dio.options.baseUrl}/user/update-profile');
      print('Payload: ${jsonEncode(profile.toJson())}');

      final response = await _dio.put(
        '/user/update-profile',
        options: Options(
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer $token',
          },
        ),
        data: profile.toJson(),
      );

      if (response.statusCode == 200) {
        print('Profile updated successfully: ${response.data}');
        return true;
      } else {
        print('Server responded with: ${response.statusCode} - ${response.data}');

        // Handle unauthorized specifically
        if (response.statusCode == 401) {
          await _apiProvider.clearToken(); // Clear invalid token
          throw Exception('Session expired. Please login again.');
        }

        throw DioException(
          requestOptions: response.requestOptions,
          response: response,
          message: 'Failed to update profile: ${response.statusCode}',
          type: DioExceptionType.badResponse,
        );
      }
    } on DioException catch (e) {
      print('Dio Error: ${e.message}');
      if (e.response != null) {
        print('Response data: ${e.response?.data}');
        print('Response status code: ${e.response?.statusCode}');
      } else if (e.type == DioExceptionType.connectionTimeout) {
        throw Exception('Connection timeout. Please check your internet connection and try again.');
      } else if (e.type == DioExceptionType.receiveTimeout) {
        throw Exception('Server is taking too long to respond. Please try again later.');
      }
      rethrow;
    } catch (e) {
      print('Unexpected error in updateProfile: $e');
      rethrow;
    }
  }

  // Upload profile image to Cloudinary
  Future<String> uploadProfileImage(File imageFile) async {
    try {
      // Validate file existence
      if (!await imageFile.exists()) {
        throw Exception('Image file does not exist');
      }

      final fileSize = await imageFile.length();
      if (fileSize > 5 * 1024 * 1024) {
        throw Exception('Image size exceeds 5MB limit');
      }

      final response = await cloudinary.uploadFile(
        CloudinaryFile.fromFile(
          imageFile.path,
          folder: 'user_profiles',
          resourceType: CloudinaryResourceType.Image,
        ),
      );

      if (response.secureUrl.isEmpty) {
        throw Exception('Failed to get secure URL from Cloudinary');
      }

      return response.secureUrl;
    } on CloudinaryException catch (e) {
      print('Cloudinary error: ${e.message}');
      throw Exception('Failed to upload image: ${e.message}');
    } catch (e) {
      print('Error uploading image to Cloudinary: $e');
      rethrow;
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
        '/user/profile/$userId',
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
        await _apiProvider.clearToken();
        throw Exception('Session expired. Please login again.');
      } else {
        throw Exception('Failed to get profile: ${response.statusCode}');
      }
    } on DioException catch (e) {
      handleDioError(e);
      rethrow;
    } catch (e) {
      print('Unexpected error in getProfile: $e');
      rethrow;
    }
  }

  // Test API connection
  Future<bool> testApiConnection() async {
    try {
      // Check if we have a token first
      if (!await _apiProvider.hasToken()) {
        print('No auth token available. Connection test will proceed without authentication.');
        // Try unauthenticated connection test
        final response = await _dio.get('/health');
        return response.statusCode == 200;
      }

      // If we have a token, try authenticated test
      final token = await _apiProvider.getToken();

      final response = await _dio.get(
        '/user/test-connection',
        options: Options(
          headers: {
            'Authorization': 'Bearer $token',
          },
        ),
      );

      return response.statusCode == 200;
    } on DioException catch (e) {
      print('API server not reachable: ${e.message}');
      return false;
    } catch (e) {
      print('Unexpected error in testApiConnection: $e');
      return false;
    }
  }

  // Helper method to handle Dio errors consistently
  void handleDioError(DioException e) {
    print('Dio Error: ${e.message}');
    if (e.response != null) {
      print('Response data: ${e.response?.data}');
      print('Response status code: ${e.response?.statusCode}');
    } else if (e.type == DioExceptionType.connectionTimeout) {
      throw Exception('Connection timeout. Please check your internet connection and try again.');
    } else if (e.type == DioExceptionType.receiveTimeout) {
      throw Exception('Server is taking too long to respond. Please try again later.');
    }
  }
}