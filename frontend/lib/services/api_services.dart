import 'dart:convert';
import 'package:http/http.dart' as http;
class ApiService {
  static const String baseUrl = "http://localhost:4000";
  static Future<Map<String, dynamic>> post(String endpoint, Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$endpoint'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(body),
    );

    return jsonDecode(response.body);
  }
}