import 'package:flutter/material.dart';

class HerShikshaScreen extends StatelessWidget {
  const HerShikshaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerShiksha'),
        backgroundColor: const Color(0xFF7B1FA2),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.school_outlined,
                  size: 80, color: Colors.purple.shade200),
              const SizedBox(height: 24),
              Text(
                'HerShiksha — Education',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Scholarships, online courses, skill development, '
                'and certification programs coming soon.',
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
