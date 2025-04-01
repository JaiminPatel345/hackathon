import 'dart:convert';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:cloudinary_public/cloudinary_public.dart';
import '../models/profile_model.dart';

class ProfileService {
  // Dio for HTTP requests with better error handling
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://192.168.101.172:4000', // Only base domain here
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    validateStatus: (status) {
      return status! < 500; // Don't throw on 4xx errors so we can handle them
    },
  ));

  // Cloudinary configuration
  final cloudinary = CloudinaryPublic('dm4xqk12g', 'makemybuddy/', cache: false);

  // Update profile data
  Future<bool> updateProfile(Profile profile, File? imageFile, String token) async {
    try {
      // Upload image if provided
      if (imageFile != null) {
        try {
          final imageUrl = await uploadProfileImage(imageFile);
          profile.avatar = imageUrl;
        } catch (e) {
          print('Image upload failed, proceeding without: $e');
        }
      }

      // Debug print the full URL and data
      print('Attempting to update profile at: ${_dio.options.baseUrl}/user/profile');
      print('Payload: ${jsonEncode(profile.toJson())}');

      final response = await _dio.put(
        '${_dio.options.baseUrl}/user/profile', // Common REST API pattern
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
        throw DioException(
          requestOptions: response.requestOptions,
          response: response,
          message: 'Failed to update profile: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      print('Dio Error: ${e.message}');
      if (e.response != null) {
        print('Response data: ${e.response?.data}');
        print('Full error details: ${e.toString()}');
      }
      rethrow;
    } catch (e) {
      print('Unexpected error: $e');
      rethrow;
    }
  }

  // Upload profile image to Cloudinary
  Future<String> uploadProfileImage(File imageFile) async {
    try {
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

      return response.secureUrl;
    } catch (e) {
      print('Error uploading image to Cloudinary: $e');
      rethrow;
    }
  }

  // Test API connection
  Future<bool> testApiConnection() async {
    try {
      final response = await _dio.get('/user/update-profile');
      return response.statusCode == 200;
    } catch (e) {
      print('API server not reachable: $e');
      return false;
    }
  }
}