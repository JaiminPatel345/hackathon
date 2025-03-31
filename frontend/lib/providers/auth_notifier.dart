// lib/providers/auth_notifier.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

// Provider for the AuthService
final authRepositoryProvider = Provider<AuthService>((ref) {
  return AuthService();
});

// Auth state class
class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? errorMessage;
  final bool isAuthenticated;

  AuthState({
    this.user,
    this.isLoading = false,
    this.errorMessage,
    this.isAuthenticated = false,
  });

  // Create a copy of the state with specified properties
  AuthState copyWith({
    UserModel? user,
    bool? isLoading,
    String? errorMessage,
    bool? isAuthenticated,
  }) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
    );
  }
}

// Auth notifier (state management)
class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;

  AuthNotifier(this._authService) : super(AuthState()) {
    _initialize();
  }

  // Check if user is logged in
  Future<void> _initialize() async {
    state = state.copyWith(isLoading: true);

    final isLoggedIn = await _authService.isLoggedIn();

    if (isLoggedIn) {
      final user = await _authService.getCurrentUser();
      state = state.copyWith(
        isAuthenticated: true,
        user: user,
        isLoading: false,
      );
    } else {
      state = state.copyWith(isLoading: false);
    }
  }

  // Register a new user
  Future<bool> register(UserModel user) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final response = await _authService.register(user);

    state = state.copyWith(
      isLoading: false,
      errorMessage: response.success ? null : response.message,
    );

    return response.success;
  }

  // Send OTP for verification
  Future<bool> sendOtp(String mobile) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final response = await _authService.sendOtp(mobile);

    state = state.copyWith(
      isLoading: false,
      errorMessage: response.success ? null : response.message,
    );

    return response.success;
  }

  // Verify OTP
  Future<bool> verifyOtp(String username, String otp) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final response = await _authService.verifyOtp(username, otp);

    if (response.success && response.data != null) {
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: response.data!.user,
        errorMessage: null,
      );
      return true;
    } else {
      state = state.copyWith(
        isLoading: false,
        errorMessage: response.message,
      );
      return false;
    }
  }

  // Login user
  Future<bool> login(String identifier, String password) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    final response = await _authService.login(identifier, password);

    if (response.success && response.data != null) {
      state = state.copyWith(
        isLoading: false,
        isAuthenticated: true,
        user: response.data!.user,
        errorMessage: null,
      );
      return true;
    } else {
      state = state.copyWith(
        isLoading: false,
        errorMessage: response.message,
      );
      return false;
    }
  }

  // Logout
  Future<void> logout() async {
    state = state.copyWith(isLoading: true);

    await _authService.logout();

    state = AuthState();
  }
}

// Provider for the AuthNotifier
final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authRepositoryProvider);
  return AuthNotifier(authService);
});