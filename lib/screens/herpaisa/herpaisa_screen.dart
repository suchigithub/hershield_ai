import 'package:flutter/material.dart';

class HerPaisaScreen extends StatelessWidget {
  const HerPaisaScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerPaisa'),
        backgroundColor: const Color(0xFF43A047),
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.account_balance_wallet_outlined,
                  size: 80, color: Colors.green.shade300),
              const SizedBox(height: 24),
              Text(
                'HerPaisa — Finance',
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Financial literacy tools, micro‑savings tracker, '
                'and budgeting features coming soon.',
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
