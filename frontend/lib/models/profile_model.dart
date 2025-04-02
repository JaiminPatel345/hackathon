class Profile {
  String name;
  List<String> interests;
  String avatar;
  Goal goal;

  Profile({
    required this.name,
    required this.interests,
    this.avatar = '',
    required this.goal,
  });

  // Convert Profile to JSON
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'interests': interests,
      'avatar': avatar,
      'goal': goal.toJson(),
    };
  }

  // Create Profile from JSON
  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      name: json['name'],
      interests: List<String>.from(json['interests']),
      avatar: json['avatar'],
      goal: Goal.fromJson(json['goal']),
    );
  }
}

class Goal {
  String title;
  String target;
  int year;
  String level;

  Goal({
    required this.title,
    required this.target,
    required this.year,
    required this.level,
  });

  // Convert Goal to JSON
  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'target': target,
      'year': year,
      'level': level,
    };
  }

  // Create Goal from JSON
  factory Goal.fromJson(Map<String, dynamic> json) {
    return Goal(
      title: json['title'],
      target: json['target'],
      year: json['year'],
      level: json['level'],
    );
  }
}