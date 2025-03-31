// lib/models/user_model.dart
class UserModel {
  final String? id;
  final String name;
  final String username;
  final String password;
  final String mobile;
  final bool? isVerified;

  UserModel({
    this.id,
    required this.name,
    required this.username,
    required this.password,
    required this.mobile,
    this.isVerified,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'] ?? json['id'],
      name: json['name'],
      username: json['username'],
      password: json['password'] ?? '',
      mobile: json['mobile'],
      isVerified: json['isVerified'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'username': username,
      'password': password,
      'mobile': mobile,
    };
  }
}

// lib/models/auth_response.dart
class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory ApiResponse.fromJson(Map<String, dynamic> json, T? Function(Map<String, dynamic>)? fromJsonT) {
    return ApiResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? 'Unknown response',
      data: json['data'] != null && fromJsonT != null ? fromJsonT(json['data']) : null,
    );
  }
}

// lib/models/auth_models.dart
class LoginRequest {
  final String identifier;
  final String password;

  LoginRequest({
    required this.identifier,
    required this.password,
  });

  Map<String, dynamic> toJson() {
    return {
      'identifier': identifier,
      'password': password,
    };
  }
}

class OtpVerificationRequest {
  final String username;
  final String givenOtp;

  OtpVerificationRequest({
    required this.username,
    required this.givenOtp,
  });

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'givenOtp': givenOtp,
    };
  }
}

class AuthResponse {
  final String token;
  final UserModel user;

  AuthResponse({
    required this.token,
    required this.user,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'],
      user: UserModel.fromJson(json['user']),
    );
  }
}