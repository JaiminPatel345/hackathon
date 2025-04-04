import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/recieved_request_provider.dart';

class ReceivedRequestsScreen extends ConsumerWidget {
  const ReceivedRequestsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final receivedRequests = ref.watch(receivedRequestProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Received Requests')),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(receivedRequestProvider.notifier).fetchRequests();
        },
        child: receivedRequests.isEmpty
            ? const Center(child: Text('No requests received yet.'))
            : ListView.builder(
          itemCount: receivedRequests.length,
          itemBuilder: (context, index) {
            final req = receivedRequests[index];
            return ListTile(
              title: Text(req.name ?? 'Unknown'),
              subtitle: Text(req.status ?? 'No message'),
            );
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(receivedRequestProvider.notifier).fetchRequests(),
        child: const Icon(Icons.refresh),
      ),
    );
  }
}
