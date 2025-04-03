class UserProfile {
  final Goal goal;
  final String id;
  final String name;
  final String username;
  final String mobile;
  final List<String> interests;
  final List<String> buddies;
  final List<String> blockedUsers;
  final List<String> pvsBuddy;
  final String avatar;
  final bool isMobileVerified;
  final bool isActive;
  final DateTime createdAt;
  final DateTime updatedAt;

  UserProfile({
    required this.goal,
    required this.id,
    required this.name,
    required this.username,
    required this.mobile,
    required this.interests,
    required this.buddies,
    required this.blockedUsers,
    required this.pvsBuddy,
    required this.avatar,
    required this.isMobileVerified,
    required this.isActive,
    required this.createdAt,
    required this.updatedAt,
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      goal: json['goal'] != null ? Goal.fromJson(json['goal']) : Goal.empty(),
      id: json['_id'] ?? '',
      name: json['name'] ?? '',
      username: json['username'] ?? '',
      mobile: json['mobile'] ?? '',
      interests: (json['interests'] as List?)?.map((e) => e.toString()).toList() ?? [],
      buddies: (json['buddies'] as List?)?.map((e) => e.toString()).toList() ?? [],
      blockedUsers: (json['blockedUsers'] as List?)?.map((e) => e.toString()).toList() ?? [],
      pvsBuddy: (json['pvsBuddy'] as List?)?.map((e) => e.toString()).toList() ?? [],
      avatar: json['avatar'] ?? '',
      isMobileVerified: json['isMobileVerified'] ?? false,
      isActive: json['isActive'] ?? false,
      createdAt: json['createdAt'] != null ? DateTime.parse(json['createdAt']) : DateTime.now(),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : DateTime.now(),
    );
  }
}

class Goal {
  final String title;
  final String target;
  final int year;
  final String level;

  Goal({
    required this.title,
    required this.target,
    required this.year,
    required this.level,
  });

  factory Goal.fromJson(Map<String, dynamic> json) {
    return Goal(
      title: json['title'] ?? '',
      target: json['target'] ?? '',
      year: json['year'] ?? 0,
      level: json['level'] ?? '',
    );
  }

  // Default empty constructor to handle null cases
  factory Goal.empty() {
    return Goal(title: '', target: '', year: 0, level: '');
  }
}