// lib/providers/user_profile_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/fetchProfile.dart';
import '../services/fetch_profile.dart';
import '../services/user_profile.dart';

// Provider for the UserProfileService
final userProfileServiceProvider = Provider<UserProfileService>((ref) {
  return UserProfileService();
});

// State for profile loading
class ProfileState {
  final UserProfile? profile;
  final bool isLoading;
  final String? error;

  ProfileState({
    this.profile,
    this.isLoading = false,
    this.error,
  });

  ProfileState copyWith({
    UserProfile? profile,
    bool? isLoading,
    String? error,
  }) {
    return ProfileState(
      profile: profile ?? this.profile,
      isLoading: isLoading ?? this.isLoading,
      error: error ?? this.error,
    );
  }
}

// Provider for fetching a profile by ID
final userProfileProvider = StateNotifierProvider.family<UserProfileNotifier, ProfileState, String>(
      (ref, userId) => UserProfileNotifier(
    ref.read(userProfileServiceProvider),
    userId,
  ),
);

// Current user profile provider
final  currentUserProfileProvider = StateNotifierProvider<UserProfileNotifier, ProfileState>(
      (ref) => UserProfileNotifier(
    ref.read(userProfileServiceProvider),
    null, // No specific ID means current user
  ),
);

class UserProfileNotifier extends StateNotifier<ProfileState> {
  final UserProfileService _profileService;
  final String? userId;

  UserProfileNotifier(this._profileService, this.userId) : super(ProfileState(isLoading: true)) {
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      print('come');
      final UserProfile? profile;
      profile = await _profileService.fetchCurrentUserProfile();
      print(profile);

      state = state.copyWith(profile: profile, isLoading: false);
        } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'An error occurred: $e',
      );
    }
  }
}