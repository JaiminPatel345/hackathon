import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/buddy_recieved_model.dart';
import '../services/buddy_req_received_service.dart';

final receivedRequestProvider = StateNotifierProvider<ReceivedRequestNotifier, List<ReceivedRequestModel>>((ref) {
  return ReceivedRequestNotifier();
});

class ReceivedRequestNotifier extends StateNotifier<List<ReceivedRequestModel>> {
  final ReceivedBuddyReqService _service = ReceivedBuddyReqService();

  ReceivedRequestNotifier() : super([]);

  Future<void> fetchRequests() async {
    final requests = await _service.fetchAllReceivedRequests();
    state = requests;
    if(state.isEmpty){
     print('No recieved request');
    }
  }
}
