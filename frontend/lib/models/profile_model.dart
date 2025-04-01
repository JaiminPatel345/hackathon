// lib/models/profile_model.dart

import 'dart:convert';

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

  factory Goal.fromJson(Map<String, dynamic> json) {
    return Goal(
      title: json['title'] as String,
      target: json['target'] as String,
      year: json['year'] as int,
      level: json['level'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'target': target,
      'year': year,
      'level': level,
    };
  }
}

class Profile {
  String name;
  List<String> interests;
  String avatar;
  Goal goal;

  Profile({
    required this.name,
    required this.interests,
    required this.avatar,
    required this.goal,
  });

  factory Profile.empty() {
    return Profile(
      name: '',
      interests: [],
      avatar: '',
      goal: Goal(
        title: '',
        target: '',
        year: DateTime.now().year,
        level: 'BEGINNER',
      ),
    );
  }

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      name: json['name'] as String,
      interests: List<String>.from(json['interests'] as List),
      avatar: json['avatar'] as String,
      goal: Goal.fromJson(json['goal'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'interests': interests,
      'avatar': avatar,
      'goal': goal.toJson(),
    };
  }

  String toJsonString() {
    return jsonEncode(toJson());
  }
}