import 'dart:convert';
import 'package:frontend/services/token_service.dart';
import 'package:http/http.dart' as http;
import '../models/buddy_recieved_model.dart';

class ReceivedBuddyReqService {
  static const String baseUrl = 'http://192.168.101.172:4000';
  final TokenService _tokenService = TokenService();

  Future<List<ReceivedRequestModel>> fetchAllReceivedRequests() async {
    try {
      final token = await _tokenService.getToken();
      if (token == null) {
        print('❌ No authentication token found');
        return [];
      }

      final response = await http.get(
        Uri.parse('$baseUrl/user/buddy-request/recieved'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final List<dynamic> requests = data['requests'];

        return requests
            .map((item) => ReceivedRequestModel.fromJson(item))
            .toList();
      } else {
        print('❌ Failed to fetch received requests: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      print('❌ Exception in fetchAllReceivedRequests: $e');
      return [];
    }
  }
}
