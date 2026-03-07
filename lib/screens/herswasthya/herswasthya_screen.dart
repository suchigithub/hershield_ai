import 'package:flutter/material.dart';

class HerSwasthyaScreen extends StatelessWidget {
  const HerSwasthyaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerSwasthya'),
        backgroundColor: const Color(0xFFEC407A),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.favorite_border,
                  size: 80, color: Colors.pink.shade200),
              const SizedBox(height: 24),
              Text(
                'HerSwasthya — Health',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Period tracker, health tips, nearby clinic finder, '
                'and telemedicine features coming soon.',
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
