import 'package:flutter/material.dart';
import '../models/fetchProfile.dart';
import '../services/fetch_profile.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ProfileService _profileService = ProfileService();
  UserProfile? _userProfile;
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchProfile();
  }

  Future<void> _fetchProfile() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final profile = await _profileService.fetchUserProfile();

      setState(() {
        _userProfile = profile;
        _isLoading = false;
        if (profile == null) {
          _error = 'Failed to load profile. Please try again.';
        }
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = 'An error occurred: $e';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchProfile,
          ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              _error!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _fetchProfile,
              child: const Text('Try Again'),
            ),
          ],
        ),
      );
    }

    if (_userProfile == null) {
      return const Center(
        child: Text('No profile data available'),
      );
    }

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
                  backgroundImage: NetworkImage(_userProfile!.avatar),
                ),
                const SizedBox(height: 16),
                Text(
                  _userProfile!.name,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  '@${_userProfile!.username}',
                  style: TextStyle(
                    fontSize: 16,
                    color: Colors.grey[600],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          _buildInfoSection('Contact Information', [
            _buildInfoRow(Icons.phone, 'Mobile', _userProfile!.mobile),
            _buildInfoRow(
              Icons.verified,
              'Verified',
              _userProfile!.isMobileVerified ? 'Yes' : 'No',
            ),
          ]),
          const SizedBox(height: 16),
          _buildInfoSection('Goals', [
            _buildInfoRow(Icons.title, 'Title', _userProfile!.goal.title),
            _buildInfoRow(Icons.animation, 'Target', _userProfile!.goal.target),
            _buildInfoRow(Icons.calendar_today, 'Year', _userProfile!.goal.year.toString()),
            _buildInfoRow(Icons.bar_chart, 'Level', _userProfile!.goal.level),
          ]),
          const SizedBox(height: 16),
          _buildInfoSection('Interests', [
            Wrap(
              spacing: 8,
              children: _userProfile!.interests.map((interest) => Chip(
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
              '${_userProfile!.createdAt.day}/${_userProfile!.createdAt.month}/${_userProfile!.createdAt.year}',
            ),
            _buildInfoRow(
              Icons.people,
              'Buddies',
              _userProfile!.buddies.isEmpty ? 'None yet' : _userProfile!.buddies.length.toString(),
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