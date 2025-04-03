import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/models/fetchProfile.dart';
import 'package:frontend/providers/api_provider.dart';
import 'package:frontend/providers/profile_provider.dart';
import 'package:frontend/providers/user_profile_provider.dart';
import 'package:frontend/screens/Auth/login_screen.dart';
import 'package:frontend/screens/home_screen.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:frontend/screens/user_profile_screen.dart';
import 'package:frontend/services/fetch_profile.dart';

void main() {
  final storage = FlutterSecureStorage();
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final bool isAuthenticated = authState.isAuthenticated;
    final profileState = ref.watch(currentUserProfileProvider);

    final String currentUserId = '67ee253df8af66ed55babc72';
    print("main user id : ");
    print(profileState.profile);
    // return MaterialApp(debugShowCheckedModeBanner: false, home: FriendRequestsScreen());
    // return MaterialApp(debugShowCheckedModeBanner: false, home: isAuthenticated ? LoginScreen() : HomeScreen());
    return MaterialApp(debugShowCheckedModeBanner: false, home: isAuthenticated ? LoginScreen() : OtherUserScreen(userId: currentUserId));
  }
}
