import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import 'package:frontend/models/auth_model.dart';
import 'package:frontend/services/storage_service.dart';

final apiServiceProvider = Provider<ApiService>((ref) {
  final storageService = ref.watch(storageServiceProvider);
  return ApiService(
    baseUrl: 'http://localhost:4000', // Replace with your actual API URL
    storageService: storageService,
  );
});

class ApiService {
  final String baseUrl;
  final StorageService storageService;

  ApiService({
    required this.baseUrl,
    required this.storageService,
  });

  Future<Map<String, String>> _getHeaders({bool requireAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (requireAuth) {
      final token = storageService.accessToken;
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }
    return headers;
  }

  Future<dynamic> _handleResponse(http.Response response) async {
    final statusCode = response.statusCode;
    final responseBody = response.body.isNotEmpty
        ? json.decode(response.body)
        : null;

    if (statusCode >= 200 && statusCode < 300) {
      return responseBody;
    }

    // Handle different error status codes
    if (statusCode == 401) {
      final refreshed = await _refreshToken();
      if (refreshed) {
        return true; // Signal to retry
      }
      throw Exception('Session expired. Please login again.');
    }

    final message = responseBody?['message'] ?? 'Unknown error occurred';
    throw ApiException(
      message: message,
      statusCode: statusCode,
      response: responseBody,
    );
  }

  Future<bool> _refreshToken() async {
    final refreshToken = storageService.refreshToken;
    if (refreshToken == null) return false;

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/refresh'),
        headers: await _getHeaders(requireAuth: false),
        body: json.encode({'refresh_token': refreshToken}),
      );

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(json.decode(response.body));
        await storageService.saveTokens(
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
        );
        return true;
      }
      await storageService.clearTokens();
      return false;
    } catch (e) {
      await storageService.clearTokens();
      return false;
    }
  }

  Future<dynamic> get(String endpoint, {bool requireAuth = true}) async {
    return _executeRequest(
          () async => http.get(
          Uri.parse('$baseUrl/$endpoint'),
          headers: await _getHeaders(requireAuth: requireAuth),
    ),
    );
  }

  Future<dynamic> post(
      String endpoint,
      dynamic data, {
        bool requireAuth = true,
      }) async {
    return _executeRequest(
          () async => http.post(
          Uri.parse('$baseUrl/$endpoint'),
          headers: await _getHeaders(requireAuth: requireAuth),
      body: json.encode(data),
    ),
    );
  }

  Future<dynamic> put(
      String endpoint,
      dynamic data, {
        bool requireAuth = true,
      }) async {
    return _executeRequest(
          () async => http.put(
          Uri.parse('$baseUrl/$endpoint'),
          headers: await _getHeaders(requireAuth: requireAuth),
      body: json.encode(data),
    ),
    );
  }

  Future<dynamic> delete(
      String endpoint, {
        bool requireAuth = true,
      }) async {
    return _executeRequest(
          () async => http.delete(
          Uri.parse('$baseUrl/$endpoint'),
          headers: await _getHeaders(requireAuth: requireAuth),
    ),
    );
  }

  Future<dynamic> _executeRequest(Future<http.Response> Function() request) async {
    bool shouldRetry = false;
    do {
      try {
        final response = await request();
        final result = await _handleResponse(response);
        shouldRetry = result == true;
        if (!shouldRetry) return result;
      } on ApiException {
        rethrow;
      } catch (e) {
        throw ApiException(message: 'Network error: ${e.toString()}');
      }
    } while (shouldRetry);
  }
}

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic response;

  ApiException({
    required this.message,
    this.statusCode,
    this.response,
  });

  @override
  String toString() => 'ApiException: $message${statusCode != null ? ' (Status: $statusCode)' : ''}';
}