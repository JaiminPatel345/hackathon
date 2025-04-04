import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/buddy_request_service.dart';

final buddyRequestProvider = StateNotifierProvider<BuddyRequestNotifier, AsyncValue<bool>>(
      (ref) => BuddyRequestNotifier(),
);

class BuddyRequestNotifier extends StateNotifier<AsyncValue<bool>> {
  BuddyRequestNotifier() : super(const AsyncValue.data(false));

  Future<void> sendRequest({required String userId, required String type}) async {
    state = const AsyncValue.loading();
    try {
      final success = await BuddyService.sendBuddyRequest(userId: userId, type: type);
      state = AsyncValue.data(success);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}
