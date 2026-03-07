import 'package:flutter/material.dart';

class HerAdhikarScreen extends StatelessWidget {
  const HerAdhikarScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerAdhikar'),
        backgroundColor: const Color(0xFF0277BD),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.gavel_outlined,
                  size: 80, color: Colors.lightBlue.shade300),
              const SizedBox(height: 24),
              Text(
                'HerAdhikar — Govt. Schemes',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Explore government schemes, eligibility checker, '
                'and application assistance coming soon.',
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
