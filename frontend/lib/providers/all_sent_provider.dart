// providers/sent_requests_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/buddy_request_service.dart';

final sentRequestsProvider = FutureProvider.family<List<Map<String, dynamic>>, String>((ref, token) async {
  return await BuddyService.getSentRequests(token);
});
