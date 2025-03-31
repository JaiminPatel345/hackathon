class StudyStats {
  final int hoursLogged;
  final int chaptersCompleted;
  final double mockTestScore;
  final int revisionsCompleted;

  StudyStats({
    required this.hoursLogged,
    required this.chaptersCompleted,
    required this.mockTestScore,
    required this.revisionsCompleted,
  });

  factory StudyStats.fromJson(Map<String, dynamic> json) {
    return StudyStats(
      hoursLogged: json['hoursLogged'] ?? 0,
      chaptersCompleted: json['chaptersCompleted'] ?? 0,
      mockTestScore: json['mockTestScore'] ?? 0.0,
      revisionsCompleted: json['revisionsCompleted'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'hoursLogged': hoursLogged,
      'chaptersCompleted': chaptersCompleted,
      'mockTestScore': mockTestScore,
      'revisionsCompleted': revisionsCompleted,
    };
  }
}