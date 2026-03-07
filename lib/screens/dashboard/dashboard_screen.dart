import 'package:flutter/material.dart';

import '../hersuraksha/hersuraksha_screen.dart';
import '../herpaisa/herpaisa_screen.dart';
import '../herswasthya/herswasthya_screen.dart';
import '../hershanti/hershanti_screen.dart';
import '../herudaan/herudaan_screen.dart';
import '../heradhikar/heradhikar_screen.dart';
import '../hershiksha/hershiksha_screen.dart';

/// Data class for each module shown on the dashboard grid.
class _ModuleItem {
  final String title;
  final String subtitle;
  final IconData icon;
  final List<Color> gradientColors;
  final Widget Function() screenBuilder;

  const _ModuleItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.gradientColors,
    required this.screenBuilder,
  });
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  /// All seven modules of the HerShield AI app.
  List<_ModuleItem> get _modules => [
        _ModuleItem(
          title: 'HerSuraksha',
          subtitle: 'Safety',
          icon: Icons.shield_outlined,
          gradientColors: [const Color(0xFFE53935), const Color(0xFFFF7043)],
          screenBuilder: () => const HerSurakshaScreen(),
        ),
        _ModuleItem(
          title: 'HerPaisa',
          subtitle: 'Finance',
          icon: Icons.account_balance_wallet_outlined,
          gradientColors: [const Color(0xFF43A047), const Color(0xFF66BB6A)],
          screenBuilder: () => const HerPaisaScreen(),
        ),
        _ModuleItem(
          title: 'HerSwasthya',
          subtitle: 'Health',
          icon: Icons.favorite_border,
          gradientColors: [const Color(0xFFEC407A), const Color(0xFFF48FB1)],
          screenBuilder: () => const HerSwasthyaScreen(),
        ),
        _ModuleItem(
          title: 'HerShanti',
          subtitle: 'Mental Wellness',
          icon: Icons.self_improvement_outlined,
          gradientColors: [const Color(0xFF5C6BC0), const Color(0xFF9FA8DA)],
          screenBuilder: () => const HerShantiScreen(),
        ),
        _ModuleItem(
          title: 'HerUdaan',
          subtitle: 'Career Restart',
          icon: Icons.rocket_launch_outlined,
          gradientColors: [const Color(0xFFFF8F00), const Color(0xFFFFCA28)],
          screenBuilder: () => const HerUdaanScreen(),
        ),
        _ModuleItem(
          title: 'HerAdhikar',
          subtitle: 'Govt. Schemes',
          icon: Icons.gavel_outlined,
          gradientColors: [const Color(0xFF0277BD), const Color(0xFF4FC3F7)],
          screenBuilder: () => const HerAdhikarScreen(),
        ),
        _ModuleItem(
          title: 'HerShiksha',
          subtitle: 'Education',
          icon: Icons.school_outlined,
          gradientColors: [const Color(0xFF7B1FA2), const Color(0xFFCE93D8)],
          screenBuilder: () => const HerShikshaScreen(),
        ),
      ];

  @override
  Widget build(BuildContext context) {
    final modules = _modules;

    return Scaffold(
      backgroundColor: const Color(0xFFF3E5F5), // light purple tint
      appBar: AppBar(
        title: const Text(
          'HerShield AI',
          style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 0.5),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {},
          ),
          IconButton(
            icon: const Icon(Icons.person_outline_rounded),
            onPressed: () {},
          ),
        ],
      ),
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Greeting banner ──────────────────────────────────
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF7B1FA2), Color(0xFFAB47BC)],
                ),
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(28),
                  bottomRight: Radius.circular(28),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back 👋',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: Colors.white70,
                        ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'How can we help you today?',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // ── Section title ────────────────────────────────────
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                'Explore Modules',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF4A148C),
                    ),
              ),
            ),

            const SizedBox(height: 12),

            // ── 2‑column grid ────────────────────────────────────
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: GridView.builder(
                  physics: const BouncingScrollPhysics(),
                  itemCount: modules.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: 16,
                    crossAxisSpacing: 16,
                    childAspectRatio: 1.0,
                  ),
                  itemBuilder: (context, index) {
                    return _ModuleCard(
                      module: modules[index],
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (_) => modules[index].screenBuilder(),
                          ),
                        );
                      },
                    );
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Reusable card widget ──────────────────────────────────────────────────────

class _ModuleCard extends StatelessWidget {
  final _ModuleItem module;
  final VoidCallback onTap;

  const _ModuleCard({required this.module, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: module.gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: module.gradientColors.first.withValues(alpha: 0.35),
              blurRadius: 12,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Icon circle
              Container(
                width: 56,
                height: 56,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.25),
                  shape: BoxShape.circle,
                ),
                child: Icon(module.icon, size: 30, color: Colors.white),
              ),
              const SizedBox(height: 14),
              // Title
              Text(
                module.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 15,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              // Subtitle
              Text(
                module.subtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withValues(alpha: 0.85),
                  fontSize: 12,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
