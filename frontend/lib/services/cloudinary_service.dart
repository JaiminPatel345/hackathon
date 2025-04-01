// lib/services/cloudinary_service.dart

import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';

class CloudinaryService {
  final Dio _dio = Dio();
  final String cloudName = 'your-cloud-name'; // Replace with your Cloudinary cloud name
  final String uploadPreset = 'your-upload-preset'; // Replace with your upload preset

  Future<String?> uploadImage(File imageFile, {String? userId}) async {
    try {
      // Create form data
      FormData formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(imageFile.path),
        'upload_preset': uploadPreset,
        'public_id': userId != null ? 'profiles/$userId' : null,
      });

      // Make the request
      Response response = await _dio.post(
        'https://api.cloudinary.com/v1_1/$cloudName/image/upload',
        data: formData,
      );

      // Return the secure URL
      return response.data['secure_url'];
    } catch (e) {
      debugPrint('Error uploading image to Cloudinary: $e');
      return null;
    }
  }
}