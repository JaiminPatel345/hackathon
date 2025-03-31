import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/screens/Auth/login_screen.dart';
// import 'package:frontend/screens/Auth/login_screen.dart';
import 'package:frontend/screens/home_screen.dart';

void main() {
  runApp(ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(debugShowCheckedModeBanner: false, home: LoginScreen());
  }
}
