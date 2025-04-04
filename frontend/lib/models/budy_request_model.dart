class BuddyRequestModel {
  final String id;
  final String receiver;
  final String sender;
  final String type;
  final String status;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime expiresAt;

  BuddyRequestModel({
    required this.id,
    required this.receiver,
    required this.sender,
    required this.type,
    required this.status,
    required this.createdAt,
    required this.updatedAt,
    required this.expiresAt,
  });

  factory BuddyRequestModel.fromJson(Map<String, dynamic> json) {
    return BuddyRequestModel(
      id: json['_id'],
      receiver: json['receiver'],
      sender: json['sender'],
      type: json['type'],
      status: json['status'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      expiresAt: DateTime.parse(json['expiresAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'receiver': receiver,
      'sender': sender,
      'type': type,
      'status': status,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'expiresAt': expiresAt.toIso8601String(),
    };
  }
}
