class ChecklistItem {
  final String id;
  final String task;
  bool isCompleted;

  ChecklistItem({
    required this.id,
    required this.task,
    this.isCompleted = false,
  });

  factory ChecklistItem.fromJson(Map<String, dynamic> json) {
    return ChecklistItem(
      id: json['id'] ?? '',
      task: json['task'] ?? '',
      isCompleted: json['isCompleted'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'task': task,
      'isCompleted': isCompleted,
    };
  }
}