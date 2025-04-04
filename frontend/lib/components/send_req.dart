import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/buddy_request_provider.dart';

class SendBuddyRequestButton extends ConsumerWidget {
  final String userId;
  final String type; // "buddy" or "follower"

  const SendBuddyRequestButton({
    super.key,
    required this.userId,
    required this.type,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final requestState = ref.watch(buddyRequestProvider);

    return ElevatedButton(
      onPressed: requestState is AsyncLoading
          ? null
          : () {
        ref.read(buddyRequestProvider.notifier).sendRequest(
          userId: userId,
          type: type,
        );
      },
      child: requestState is AsyncLoading
          ? const CircularProgressIndicator()
          : Text(type == "buddy" ? "Send Buddy Request" : "Follow"),
    );
  }
}
