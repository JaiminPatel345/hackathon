// providers/auth_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

// Auth state to track authentication status
class AuthState {
  final bool isAuthenticated;
  final bool isLoading;
  final String? errorMessage;
  final UserModel? user;
  final String? token;

  AuthState({
    this.isAuthenticated = false,
    this.isLoading = false,
    this.errorMessage,
    this.user,
    this.token,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    String? errorMessage,
    UserModel? user,
    String? token,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage ?? this.errorMessage,
      user: user ?? this.user,
      token: token ?? this.token,
    );
  }
}

// Auth notifier to handle authentication logic
class AuthNotifier extends StateNotifier<AuthState> {
  final ApiProvider _apiProvider;

  AuthNotifier(this._apiProvider) : super(AuthState());

  // Login method that handles both username and mobile number login
  Future<bool> login(String identifier, String password) async {
    // Set loading state
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      // Call API for login
      final apiResponse = await _apiProvider.loginUser(identifier, password);

      if (apiResponse.success) {
        // Extract data from response
        final userData = apiResponse.data['user'];
        final token = apiResponse.data['token'];

        // Create user model from response data
        final user = UserModel.fromJson(userData);

        // Update state with authenticated user and token
        state = state.copyWith(
          isAuthenticated: true,
          isLoading: false,
          user: user,
          token: token,
          errorMessage: null,
        );

        return true;
      } else {
        // Login failed
        state = state.copyWith(
          isLoading: false,
          errorMessage: apiResponse.message,
        );
        return false;
      }
    } catch (e) {
      // Handle errors
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'An error occurred: ${e.toString()}',
      );
      return false;
    }
  }

  // Register a new user
  Future<bool> register(UserModel user) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final apiResponse = await _apiProvider.registerUser(user);

      if (apiResponse.success) {
        state = state.copyWith(isLoading: false);
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: apiResponse.message,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Registration failed: ${e.toString()}',
      );
      return false;
    }
  }

  // Send OTP for mobile verification
  Future<bool> sendOtp(String mobileNumber) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final apiResponse = await _apiProvider.sendOtp(mobileNumber);

      state = state.copyWith(isLoading: false);

      if (apiResponse.success) {
        return true;
      } else {
        state = state.copyWith(errorMessage: apiResponse.message);
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to send OTP: ${e.toString()}',
      );
      return false;
    }
  }

  // Verify OTP
  Future<bool> verifyOtp(String mobileNumber, String otp) async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final apiResponse = await _apiProvider.verifyOtp(mobileNumber, otp);

      if (apiResponse.success) {
        // If verification includes user data and token
        if (apiResponse.data != null) {
          final userData = apiResponse.data['user'];
          final token = apiResponse.data['token'];

          if (userData != null) {
            final user = UserModel.fromJson(userData);

            state = state.copyWith(
              isAuthenticated: true,
              isLoading: false,
              user: user,
              token: token,
            );
          } else {
            state = state.copyWith(isLoading: false);
          }
        } else {
          state = state.copyWith(isLoading: false);
        }

        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          errorMessage: apiResponse.message,
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'OTP verification failed: ${e.toString()}',
      );
      return false;
    }
  }

  // Logout method
  Future<void> logout() async {
    state = state.copyWith(isLoading: true);

    try {
      // API call would go here if needed

      // Clear user data
      state = AuthState();
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to logout: ${e.toString()}',
      );
    }
  }
}

// Create a provider for ApiProvider
final apiProviderProvider = Provider<ApiProvider>((ref) {
  return ApiProvider();
});

// Provider for auth notifier
final authNotifierProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final apiProvider = ref.watch(apiProviderProvider);
  return AuthNotifier(apiProvider);
});