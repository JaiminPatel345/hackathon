// lib/providers/profile_provider.dart

import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/profile_model.dart';
import '../services/profile_service.dart';

// State notifier for profile state
class ProfileNotifier extends StateNotifier<AsyncValue<Profile>> {
  final ProfileService _profileService = ProfileService();

  ProfileNotifier() : super(AsyncValue.data(Profile.empty()));

  // Create or update profile
  Future<bool> saveProfile(Profile profile, File imageFile) async {
    try {
      state = const AsyncValue.loading();

      final savedProfile = await _profileService.createProfile(profile, imageFile);

      if (savedProfile != null) {
        state = AsyncValue.data(savedProfile);
        return true;
      } else {
        state = AsyncValue.error(
          'Failed to save profile',
          StackTrace.current,
        );
        return false;
      }
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
      return false;
    }
  }

  // Fetch user profile
  Future<void> fetchProfile(String userId) async {
    try {
      state = const AsyncValue.loading();

      final profile = await _profileService.getProfile(userId);

      if (profile != null) {
        state = AsyncValue.data(profile);
      } else {
        state = AsyncValue.error(
          'Failed to fetch profile',
          StackTrace.current,
        );
      }
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
    }
  }

  // Update profile
  Future<bool> updateProfile(String userId, Profile profile, {File? imageFile}) async {
    try {
      state = const AsyncValue.loading();

      final updatedProfile = await _profileService.updateProfile(
        userId,
        profile,
        imageFile: imageFile,
      );

      if (updatedProfile != null) {
        state = AsyncValue.data(updatedProfile);
        return true;
      } else {
        state = AsyncValue.error(
          'Failed to update profile',
          StackTrace.current,
        );
        return false;
      }
    } catch (error, stackTrace) {
      state = AsyncValue.error(error, stackTrace);
      return false;
    }
  }
}

// Provider for profile state
final profileProvider = StateNotifierProvider<ProfileNotifier, AsyncValue<Profile>>(
      (ref) => ProfileNotifier(),
);