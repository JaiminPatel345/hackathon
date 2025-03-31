import '../models/user_model.dart';
import '../models/study_stats.dart';
import '../models/checklist_item.dart';
import '../models/study_buddy.dart';

class MockDataService {
  // User data
  UserModel getUser() {
    return UserModel(
      id: '1',
      name: 'Jaiminbhai',
      username: '',
      password: '',
      mobile: '',
    );
  }

  // User's study stats
  StudyStats getUserStats() {
    return StudyStats(
      hoursLogged: 4,
      chaptersCompleted: 10,
      mockTestScore: 75.0,
      revisionsCompleted: 2,
    );
  }

  // User's checklist items
  List<ChecklistItem> getUserChecklist() {
    return [
      ChecklistItem(
        id: '1',
        task: 'Study for at least 3 hours',
        isCompleted: false,
      ),
      ChecklistItem(
        id: '2',
        task: 'Solve previous year\'s questions',
        isCompleted: true,
      ),
      ChecklistItem(id: '3', task: 'Complete 20+ MCQs', isCompleted: false),
      ChecklistItem(
        id: '4',
        task: 'Discuss doubts with a friend',
        isCompleted: false,
      ),
    ];
  }

  // Buddy data
  StudyBuddy getBuddy() {
    return StudyBuddy(
      id: '2',
      name: 'Study Buddy',
      stats: StudyStats(
        hoursLogged: 5,
        chaptersCompleted: 8,
        mockTestScore: 80.0,
        revisionsCompleted: 3,
      ),
      checklistItems: [
        ChecklistItem(
          id: '1',
          task: 'Study for at least 3 hours',
          isCompleted: true,
        ),
        ChecklistItem(
          id: '2',
          task: 'Solve previous year\'s questions',
          isCompleted: false,
        ),
        ChecklistItem(id: '3', task: 'Complete 20+ MCQs', isCompleted: false),
        ChecklistItem(
          id: '4',
          task: 'Discuss doubts with a friend',
          isCompleted: true,
        ),
      ],
    );
  }
}
