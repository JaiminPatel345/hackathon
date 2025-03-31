import 'package:http/http.dart';

import '../models/user_model.dart';
import '../models/study_stats.dart';
import '../models/checklist_item.dart';
import '../models/study_buddy.dart';
import '../services/auth_service.dart';
import '../services/mock_data_service.dart';

class StudyRepository {
  final AuthService _apiService;
  final MockDataService _mockDataService;
  final bool _useMockData;

  StudyRepository({
    AuthService? apiService,
    MockDataService? mockDataService,
    bool useMockData = true, // Default to mock data
  }) :
        _apiService = apiService ?? AuthService(),
        _mockDataService = mockDataService ?? MockDataService(),
        _useMockData = useMockData;

  // User data methods
  Future<UserModel> getUser() async {
    if (_useMockData) {
      return _mockDataService.getUser();
    } else {
      final userData = await _apiService.get('users/current');
      return UserModel.fromJson(userData);
    }
  }

  // User's study stats
  Future<StudyStats> getUserStats() async {
    if (_useMockData) {
      return _mockDataService.getUserStats();
    } else {
      final statsData = await _apiService.get('users/current/stats');
      return StudyStats.fromJson(statsData);
    }
  }

  // User's checklist
  Future<List<ChecklistItem>> getUserChecklist() async {
    if (_useMockData) {
      return _mockDataService.getUserChecklist();
    } else {
      final checklistData = await _apiService.get('users/current/checklist');
      List<dynamic> items = checklistData['items'] ?? [];
      return items.map((item) => ChecklistItem.fromJson(item)).toList();
    }
  }

  // Update a checklist item
  Future<bool> updateChecklistItem(String itemId, bool isCompleted) async {
    if (_useMockData) {
      // For mock data, we'd simply return success
      return true;
    } else {
      try {
        await AuthService.put('users/current/checklist/$itemId');
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  // Buddy data
  Future<StudyBuddy> getBuddyData() async {
    if (_useMockData) {
      return _mockDataService.getBuddy();
    } else {
      final buddyData = await _apiService.get('users/current/buddy');
      return StudyBuddy.fromJson(buddyData);
    }
  }
}