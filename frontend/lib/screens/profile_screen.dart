import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/components/req_button.dart';
import 'package:frontend/screens/recieved_buddy_request.dart';
import 'package:frontend/screens/user_profile_screen.dart';
import 'package:frontend/services/auth_service.dart';
import '../models/fetchProfile.dart';
import '../providers/api_provider.dart';
import '../services/fetch_profile.dart';
import 'Auth/login_screen.dart';

// Define providers
final profileServiceProvider = Provider<ProfileService>((ref) {
  return ProfileService();
});

// State notifier to manage profile state
class ProfileNotifier extends StateNotifier<AsyncValue<UserProfile?>> {
  final ProfileService _profileService;

  ProfileNotifier(this._profileService) : super(const AsyncValue.loading()) {
    fetchProfile();
  }

  Future<void> fetchProfile() async {
    state = const AsyncValue.loading();
    try {
      final profile = await _profileService.fetchUserProfile();
      state = AsyncValue.data(profile);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
}

// Profile provider that uses the notifier
final profileProvider =
    StateNotifierProvider<ProfileNotifier, AsyncValue<UserProfile?>>((ref) {
      final profileService = ref.watch(profileServiceProvider);
      return ProfileNotifier(profileService);
    });

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});


  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileState = ref.watch(profileProvider);
    final userId = '67ef5d766b88ead0026e99e4';
    final authState = ref.watch(authNotifierProvider);
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => ref.read(profileProvider.notifier).fetchProfile(),
          ),
          IconButton(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => OtherUserScreen(userId: userId),
                ),
              );
            },
            icon: Icon(Icons.person),
          ),
          PopupMenuButton(
            onSelected: (value) {
              switch (value) {
                case 'logout':
                 ref.read(authNotifierProvider.notifier).logout();
              }
            },
            itemBuilder: (BuildContext context) {
              return [
                PopupMenuItem(
                  value: 'logout',
                  child: Text('Log out'),
                )
              ];
            },
          ),
        ],
      ),
      body: profileState.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error:
            (error, stackTrace) => Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'An error occurred: $error',
                    style: const TextStyle(color: Colors.red),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed:
                        () => ref.read(profileProvider.notifier).fetchProfile(),
                    child: const Text('Try Again'),
                  ),
                ],
              ),
            ),
        data: (userProfile) {
          if (userProfile == null) {
            return const Center(child: Text('No profile data available'));
          }
          return _buildProfileContent(context, userProfile);
        },
      ),
    );
  }

  Widget _buildProfileContent(BuildContext context, UserProfile userProfile) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 60,
                  backgroundImage: NetworkImage(userProfile.avatar),
                ),
                const SizedBox(height: 16),
                Text(
                  userProfile.name,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '@${userProfile.username}',
                  style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                ),
                const SizedBox(height: 16),
                MinimalistButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ReceivedRequestsScreen(),
                      ),
                    );
                  },
                  defaultText: 'Requests',
                  defaultIcon: Icons.person_4,
                  activeText: 'Request',
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildInfoSection('Contact Information', [
            _buildInfoRow(Icons.phone, 'Mobile', userProfile.mobile),
            _buildInfoRow(
              Icons.verified,
              'Verified',
              userProfile.isMobileVerified ? 'Yes' : 'No',
            ),
          ]),
          const SizedBox(height: 16),
          _buildInfoSection('Goals', [
            _buildInfoRow(Icons.title, 'Title', userProfile.goal.title),
            _buildInfoRow(Icons.animation, 'Target', userProfile.goal.target),
            _buildInfoRow(
              Icons.calendar_today,
              'Year',
              userProfile.goal.year.toString(),
            ),
            _buildInfoRow(Icons.bar_chart, 'Level', userProfile.goal.level),
          ]),
          const SizedBox(height: 16),
          _buildInfoSection('Interests', [
            Wrap(
              spacing: 8,
              children:
                  userProfile.interests
                      .map(
                        (interest) => Chip(
                          label: Text(interest),
                          backgroundColor: Colors.blue[100],
                        ),
                      )
                      .toList(),
            ),
          ]),
          const SizedBox(height: 16),
          _buildInfoSection('Account Information', [
            _buildInfoRow(
              Icons.calendar_month,
              'Joined',
              '${userProfile.createdAt.day}/${userProfile.createdAt.month}/${userProfile.createdAt.year}',
            ),
            _buildInfoRow(
              Icons.people,
              'Buddies',
              userProfile.buddies.isEmpty
                  ? 'None yet'
                  : userProfile.buddies.length.toString(),
            ),
          ]),
        ],
      ),
    );
  }

  Widget _buildInfoSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const Divider(),
        ...children,
      ],
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Colors.blue),
          const SizedBox(width: 8),
          Text('$label:', style: const TextStyle(fontWeight: FontWeight.w500)),
          const SizedBox(width: 8),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 16))),
        ],
      ),
    );
  }
}
