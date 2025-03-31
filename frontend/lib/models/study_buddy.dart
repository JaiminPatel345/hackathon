import 'package:frontend/models/study_stats.dart';

import 'checklist_item.dart';

class StudyBuddy {
  final String id;
  final String name;
  final StudyStats stats;
  final List<ChecklistItem> checklistItems;

  StudyBuddy({
    required this.id,
    required this.name,
    required this.stats,
    required this.checklistItems,
  });

  factory StudyBuddy.fromJson(Map<String, dynamic> json) {
    List<dynamic> checklistJson = json['checklistItems'] ?? [];

    return StudyBuddy(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      stats: StudyStats.fromJson(json['stats'] ?? {}),
      checklistItems: checklistJson
          .map((item) => ChecklistItem.fromJson(item))
          .toList(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'stats': stats.toJson(),
      'checklistItems': checklistItems.map((item) => item.toJson()).toList(),
    };
  }
}

