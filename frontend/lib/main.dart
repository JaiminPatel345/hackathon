import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/providers/api_provider.dart';
import 'package:frontend/screens/Auth/login_screen.dart';
import 'package:frontend/screens/home_screen.dart';
import 'package:frontend/screens/profile_setup.dart';

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authNotifierProvider);
    final bool isAuthenticated = authState.isAuthenticated;
    return MaterialApp(debugShowCheckedModeBanner: false, home: ProfileSetup(userId: 'example'));
    // return MaterialApp(debugShowCheckedModeBanner: false, home: isAuthenticated ? LoginScreen() : HomeScreen());
  }
}
