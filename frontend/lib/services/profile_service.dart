// lib/services/profile_service.dart

import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import '../models/profile_model.dart';
import 'cloudinary_service.dart';

class ProfileService {
  final Dio _dio = Dio();
  final CloudinaryService _cloudinaryService = CloudinaryService();
  final String baseUrl = 'http://192.168.101.172:4000'; // For Android emulator, adjust accordingly

  // Create profile
  Future<Profile?> createProfile(Profile profile, File imageFile) async {
    try {
      // First upload the image to Cloudinary
      final imageUrl = await _cloudinaryService.uploadImage(imageFile);
      if (imageUrl == null) {
        throw Exception('Failed to upload image');
      }

      // Update profile with image URL
      profile.avatar = imageUrl;

      // Send profile data to server
      final response = await _dio.post(
        '$baseUrl/user/update-profile',
        data: profile.toJson(),
        options: Options(headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': 'Bearer $token',
        }),
      );

      if (response.statusCode == 201) {
        return Profile.fromJson(response.data);
      } else {
        throw Exception('Failed to create profile');
      }
    } catch (e) {
      debugPrint('Error creating profile: $e');
      return null;
    }
  }

  // Get profile by ID
  Future<Profile?> getProfile(String userId) async {
    String token = '';
    try {
      final response = await _dio.get(
        '$baseUrl/profiles/$userId',
        options: Options(headers: {
          'Authorization': 'Bearer $token',
        }),
      );

      if (response.statusCode == 200) {
        return Profile.fromJson(response.data);
      } else {
        throw Exception('Failed to get profile');
      }
    } catch (e) {
      debugPrint('Error getting profile: $e');
      return null;
    }
  }

  // Update profile
  Future<Profile?> updateProfile(String userId, Profile profile, {File? imageFile}) async {
    try {
      // If a new image is provided, upload it first
      if (imageFile != null) {
        final imageUrl = await _cloudinaryService.uploadImage(imageFile, userId: userId);
        if (imageUrl != null) {
          profile.avatar = imageUrl;
        }
      }

      // Send updated profile data to server
      final response = await _dio.put(
        '$baseUrl/profiles/$userId',
        data: profile.toJson(),
        options: Options(headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': 'Bearer $token',
        }),
      );

      if (response.statusCode == 200) {
        return Profile.fromJson(response.data);
      } else {
        throw Exception('Failed to update profile');
      }
    } catch (e) {
      debugPrint('Error updating profile: $e');
      return null;
    }
  }
}