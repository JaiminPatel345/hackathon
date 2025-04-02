import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenService {
  static const String _tokenKey = 'auth_token';

  // Use singleton pattern to ensure consistency
  static final TokenService _instance = TokenService._internal();
  factory TokenService() => _instance;
  TokenService._internal();

  final _storage = const FlutterSecureStorage();

  Future<void> storeToken(String token) async {
    try {
      if (token.isEmpty) {
        print("WARNING: Attempting to store empty token");
        return;
      }

      await _storage.write(key: _tokenKey, value: token);
      print("Token stored successfully");

      // Verify it was stored
      final verifyToken = await _storage.read(key: _tokenKey);
      print("Verification check: Token exists = ${verifyToken != null && verifyToken.isNotEmpty}");
    } catch (e) {
      print("ERROR STORING TOKEN: $e");
      throw Exception("Failed to store token: $e");
    }
  }

  Future<String?> getToken() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      print("Token retrieved: ${token != null ? 'YES (${token.length} chars)' : 'NO'}");
      return token;
    } catch (e) {
      print("ERROR GETTING TOKEN: $e");
      return null;
    }
  }

  Future<bool> hasToken() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      final result = token != null && token.isNotEmpty;
      print("Has token check: $result");
      return result;
    } catch (e) {
      print("ERROR CHECKING TOKEN: $e");
      return false;
    }
  }

  Future<void> deleteToken() async {
    try {
      await _storage.delete(key: _tokenKey);
      print("Token deleted");
    } catch (e) {
      print("ERROR DELETING TOKEN: $e");
    }
  }
}