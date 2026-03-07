import 'package:flutter/material.dart';

class HerShantiScreen extends StatelessWidget {
  const HerShantiScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerShanti'),
        backgroundColor: const Color(0xFF5C6BC0),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.self_improvement_outlined,
                  size: 80, color: Colors.indigo.shade200),
              const SizedBox(height: 24),
              Text(
                'HerShanti — Mental Wellness',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              const Text(
                'AI mood journal, guided meditation, therapist connect, '
                'and anonymous support groups coming soon.',
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
