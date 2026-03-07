import 'package:flutter/material.dart';

class HerUdaanScreen extends StatelessWidget {
  const HerUdaanScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerUdaan'),
        backgroundColor: const Color(0xFFFF8F00),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.rocket_launch_outlined,
                  size: 80, color: Colors.orange.shade300),
              const SizedBox(height: 24),
              Text(
                'HerUdaan — Career Restart',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Resume builder, skill courses, job board, '
                'and mentorship matching coming soon.',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.grey, fontSize: 14),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
