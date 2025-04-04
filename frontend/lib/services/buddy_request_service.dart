import 'dart:convert';
import 'package:frontend/services/token_service.dart';
import 'package:http/http.dart' as http;

class BuddyService {
  static const String baseUrl = 'http://192.168.101.172:4000';

  static Future<bool> sendBuddyRequest({
    required String userId,
    required String type, // "buddy" or "follower"
  }) async {
    final url = Uri.parse('$baseUrl/user/buddy-request/send');
    final tokenService = TokenService();
    final token = await tokenService.getToken();
    final response = await http.post(
      url,
      headers: {'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'userId': userId,
        'type': type,
      }),
    );

    if (response.statusCode == 200) {
      return true;
    } else {
      print('Error: ${response.statusCode}, Body: ${response.body}');
      return false;
    }
  }
  static Future<List<Map<String, dynamic>>> getSentRequests(String token) async {
    final url = Uri.parse('$baseUrl/user/buddy-request/sent');

    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final body = jsonDecode(response.body);
      return List<Map<String, dynamic>>.from(body['data']); // Adjust key if different
    } else {
      print('Failed to fetch sent requests: ${response.statusCode}, ${response.body}');
      throw Exception('Failed to load sent requests');
    }
  }
}
