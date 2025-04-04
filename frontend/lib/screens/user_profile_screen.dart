// lib/screens/other_user_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/components/req_button.dart';
import '../components/send_req.dart';
import '../providers/buddy_request_provider.dart';
import '../providers/user_profile_provider.dart';
import '../services/buddy_request_service.dart';

class OtherUserScreen extends ConsumerWidget {
  final String userId;
  const OtherUserScreen({super.key, required this.userId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileState = ref.watch(userProfileProvider(userId));
    print('in user profile id $userId');
    return Scaffold(
      appBar: AppBar(
        title: const Text('User Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.read(userProfileProvider(userId).notifier).fetchProfile();
            },
          ),
        ],
      ),
      body: _buildBody(context, profileState, ref),
    );
  }



  Widget _buildBody(BuildContext context, ProfileState state, WidgetRef ref) {
    if (state.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (state.error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              state.error!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: () {
                ref.read(userProfileProvider(userId).notifier).fetchProfile();
              },
              child: const Text('Try Again'),
            ),
          ],
        ),
      );
    }

    final userProfile = state.profile;
    if (userProfile == null) {
      return const Center(
        child: Text('No profile data available'),
      );
    }
    final profileState = ref.watch(currentUserProfileProvider);
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
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
                const SizedBox(width: 10,),
                SendBuddyRequestButton(userId: userId, type: 'buddy'),
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
            _buildInfoRow(Icons.calendar_today, 'Year', userProfile.goal.year.toString()),
            _buildInfoRow(Icons.bar_chart, 'Level', userProfile.goal.level),
          ]),
          const SizedBox(height: 16),
          _buildInfoSection('Interests', [
            Wrap(
              spacing: 8,
              children: userProfile.interests.map((interest) => Chip(
                label: Text(interest),
                backgroundColor: Colors.blue[100],
              )).toList(),
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
              userProfile.buddies.isEmpty ? 'None yet' : userProfile.buddies.length.toString(),
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
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
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
          Text(
            '$label:',
            style: const TextStyle(
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(
                fontSize: 16,
              ),
            ),
          ),
        ],
      ),
    );
  }
}