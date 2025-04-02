import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/profile_model.dart';
import '../services/profile_service.dart';

// Provider for the ProfileService
final profileServiceProvider = Provider<ProfileService>((ref) {
  return ProfileService();
});

// State notifier for Profile
class ProfileNotifier extends StateNotifier<AsyncValue<Profile?>> {
  final ProfileService _profileService;
  final String userId;

  ProfileNotifier(this._profileService, this.userId) : super(const AsyncValue.data(null));

  // Save profile with image
  Future<bool> saveProfile(Profile profile, File profileImage) async {
    try {
      // Show loading state
      state = const AsyncValue.loading();

      // Call service to upload image and update profile
      final success = await _profileService.updateProfile(profile, userId);

      if (success) {
        // Update state with the new profile
        state = AsyncValue.data(profile);
      }

      return success;
    } catch (e, stackTrace) {
      // Set error state
      state = AsyncValue.error(e, stackTrace);
      return false;
    }
  }
}

// Provider for the ProfileNotifier
final profileProvider = StateNotifierProvider<ProfileNotifier, AsyncValue<Profile?>>((ref) {
  final profileService = ref.watch(profileServiceProvider);
  // You need to get the userId from somewhere - this could be from a user auth provider
  final userId = ref.read(authProvider).user?.uid ?? '';

  return ProfileNotifier(profileService, userId);
});

// This is a mock auth provider - replace with your actual auth provider
final authProvider = Provider((ref) => AuthService());

class AuthService {
  User? get user => User(uid: 'mock-user-id');
}

class User {
  final String uid;
  User({required this.uid});
}
