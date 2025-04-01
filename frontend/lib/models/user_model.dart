 class UserModel {
  final String? id;
  final String name;
  final String username;
  final String password;
  final String mobile;

  UserModel({
    this.id,
    required this.name,
    required this.username,
    required this.password,
    required this.mobile,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['_id'],
      name: json['name'],
      username: json['username'],
      password: json['password'] ?? '',
      mobile: json['mobile'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'username': username,
      'password': password,
      'mobile': mobile,
    };
  }
}