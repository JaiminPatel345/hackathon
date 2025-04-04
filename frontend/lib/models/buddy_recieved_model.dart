class ReceivedRequestModel {
  final String requestId;
  final String buddyId;
  final String name;
  final String avatar;
  final String status;

  ReceivedRequestModel({
    required this.name,
    required this.avatar,
    required this.requestId,
    required this.buddyId,
    required this.status,
  });

  Map<String, dynamic> toJson() {
    return {'_id': requestId, 'name': name, 'avatar': avatar, 'status': status};
  }

  factory ReceivedRequestModel.fromJson(Map<String, dynamic> json) {
    return ReceivedRequestModel(
      name: 'Latin',
      avatar: 'avatarUrl',
      requestId: '123',
      buddyId: '456',
      status: 'pending',
    );
  }
}
