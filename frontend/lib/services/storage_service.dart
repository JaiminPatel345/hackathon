import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

final storageServiceProvider = Provider<StorageService>((ref) {
  throw UnimplementedError('StorageService not initialized');
});

final initializeStorageServiceProvider = FutureProvider<void>((ref) async {
  final storage = StorageService();
  await storage.initialize();
  ref.container.updateOverrides(
    storageServiceProvider as List<Override>,
  );
});

class StorageService {
  static const String _accessTokenKey = 'access_token';
  static const String _refreshTokenKey = 'refresh_token';
  static const String _userKey = 'user_data';

  late final SharedPreferences _prefs;

  Future<void> initialize() async {
    _prefs = await SharedPreferences.getInstance();
  }

  Future<bool> saveTokens({
    required String accessToken,
    required String refreshToken,
  }) async {
    try {
      await Future.wait([
        _prefs.setString(_accessTokenKey, accessToken),
        _prefs.setString(_refreshTokenKey, refreshToken),
      ]);
      return true;
    } catch (e) {
      throw StorageException('Failed to save tokens: $e');
    }
  }

  String? get accessToken => _prefs.getString(_accessTokenKey);
  String? get refreshToken => _prefs.getString(_refreshTokenKey);

  Future<bool> clearTokens() async {
    try {
      await Future.wait([
        _prefs.remove(_accessTokenKey),
        _prefs.remove(_refreshTokenKey),
      ]);
      return true;
    } catch (e) {
      throw StorageException('Failed to clear tokens: $e');
    }
  }

  Future<bool> saveUserData(String userJson) async {
    try {
      return await _prefs.setString(_userKey, userJson);
    } catch (e) {
      throw StorageException('Failed to save user data: $e');
    }
  }

  String? get userData => _prefs.getString(_userKey);

  Future<bool> clearUserData() async {
    try {
      return await _prefs.remove(_userKey);
    } catch (e) {
      throw StorageException('Failed to clear user data: $e');
    }
  }

  bool get isLoggedIn => accessToken != null && accessToken!.isNotEmpty;

  Future<bool> clearAll() async {
    try {
      return await _prefs.clear();
    } catch (e) {
      throw StorageException('Failed to clear storage: $e');
    }
  }
}

class StorageException implements Exception {
  final String message;
  StorageException(this.message);

  @override
  String toString() => 'StorageException: $message';
}