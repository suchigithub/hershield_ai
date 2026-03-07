import 'dart:async';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shake/shake.dart';

class HerSurakshaScreen extends StatefulWidget {
  const HerSurakshaScreen({super.key});

  @override
  State<HerSurakshaScreen> createState() => _HerSurakshaScreenState();
}

class _HerSurakshaScreenState extends State<HerSurakshaScreen> {
  // ── Shake detection ──────────────────────────────────────────────────────
  ShakeDetector? _shakeDetector;
  int _shakeCount = 0;
  Timer? _shakeResetTimer;

  // ── GPS state ────────────────────────────────────────────────────────────
  Position? _currentPosition;
  bool _loadingLocation = false;
  String? _locationError;

  // ── SOS state ────────────────────────────────────────────────────────────
  bool _sosTriggered = false;

  @override
  void initState() {
    super.initState();
    _initShakeDetector();
    _fetchCurrentLocation();
  }

  @override
  void dispose() {
    _shakeDetector?.stopListening();
    _shakeResetTimer?.cancel();
    super.dispose();
  }

  // ── Shake detection logic ────────────────────────────────────────────────

  void _initShakeDetector() {
    _shakeDetector = ShakeDetector.autoStart(
      minimumShakeCount: 1,
      shakeThresholdGravity: 2.5,
      shakeSlopTimeMS: 500,
      onPhoneShake: _onShakeDetected,
    );
  }

  void _onShakeDetected() {
    _shakeCount++;

    // Reset counter after 3 seconds of no shaking
    _shakeResetTimer?.cancel();
    _shakeResetTimer = Timer(const Duration(seconds: 3), () {
      _shakeCount = 0;
    });

    if (_shakeCount >= 3) {
      _shakeCount = 0;
      _shakeResetTimer?.cancel();
      _triggerSOS();
    }
  }

  // ── SOS trigger ──────────────────────────────────────────────────────────

  void _triggerSOS() {
    if (_sosTriggered) return; // avoid duplicate dialogs
    setState(() => _sosTriggered = true);

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        icon: const Icon(Icons.warning_amber_rounded,
            size: 48, color: Colors.red),
        title: const Text('🚨 SOS Triggered!',
            style: TextStyle(fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Emergency alert is being sent to your emergency contacts.',
              textAlign: TextAlign.center,
            ),
            if (_currentPosition != null) ...[
              const SizedBox(height: 16),
              Text(
                'Location: ${_currentPosition!.latitude.toStringAsFixed(5)}, '
                '${_currentPosition!.longitude.toStringAsFixed(5)}',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              setState(() => _sosTriggered = false);
            },
            child: const Text('I am safe — Cancel'),
          ),
          FilledButton.icon(
            onPressed: () {
              Navigator.of(ctx).pop();
              setState(() => _sosTriggered = false);
              // TODO: connect to backend to send real SOS
            },
            icon: const Icon(Icons.call),
            label: const Text('Call Emergency'),
            style: FilledButton.styleFrom(backgroundColor: Colors.red),
          ),
        ],
      ),
    );
  }

  // ── GPS location ─────────────────────────────────────────────────────────

  Future<void> _fetchCurrentLocation() async {
    setState(() {
      _loadingLocation = true;
      _locationError = null;
    });

    try {
      // Check if location services are enabled
      final serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() {
          _locationError = 'Location services are disabled. Please enable GPS.';
          _loadingLocation = false;
        });
        return;
      }

      // Check / request permission
      var permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          setState(() {
            _locationError = 'Location permission denied.';
            _loadingLocation = false;
          });
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        setState(() {
          _locationError =
              'Location permission permanently denied. Enable it in Settings.';
          _loadingLocation = false;
        });
        return;
      }

      // Get current position
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 15),
        ),
      );

      setState(() {
        _currentPosition = position;
        _loadingLocation = false;
      });
    } catch (e) {
      setState(() {
        _locationError = 'Error fetching location: $e';
        _loadingLocation = false;
      });
    }
  }

  // ── UI ───────────────────────────────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('HerSuraksha'),
        backgroundColor: const Color(0xFFE53935),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // ── SOS banner ───────────────────────────────────────
            _buildSOSCard(),
            const SizedBox(height: 20),

            // ── GPS card ─────────────────────────────────────────
            _buildLocationCard(),
            const SizedBox(height: 20),

            // ── Quick actions ────────────────────────────────────
            _buildQuickActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildSOSCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFE53935), Color(0xFFFF7043)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFE53935).withValues(alpha: 0.3),
            blurRadius: 16,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          const Icon(Icons.shield, size: 48, color: Colors.white),
          const SizedBox(height: 12),
          const Text(
            'Shake your phone 3 times\nto trigger SOS',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 16),
          ElevatedButton.icon(
            onPressed: _triggerSOS,
            icon: const Icon(Icons.warning_amber_rounded),
            label: const Text('Manual SOS'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.red,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(30),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLocationCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.location_on, color: Color(0xFF7B1FA2)),
              const SizedBox(width: 8),
              Text(
                'Your Location',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const Spacer(),
              IconButton(
                onPressed: _fetchCurrentLocation,
                icon: const Icon(Icons.refresh, size: 20),
              ),
            ],
          ),
          const Divider(),
          if (_loadingLocation)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Center(child: CircularProgressIndicator()),
            )
          else if (_locationError != null)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: Text(_locationError!,
                  style: const TextStyle(color: Colors.red)),
            )
          else if (_currentPosition != null) ...[
            _locationRow(
                'Latitude', _currentPosition!.latitude.toStringAsFixed(6)),
            const SizedBox(height: 8),
            _locationRow(
                'Longitude', _currentPosition!.longitude.toStringAsFixed(6)),
            const SizedBox(height: 8),
            _locationRow(
                'Accuracy', '${_currentPosition!.accuracy.toStringAsFixed(1)} m'),
          ] else
            const Text('Tap refresh to fetch location'),
        ],
      ),
    );
  }

  Widget _locationRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(color: Colors.grey)),
        Text(value,
            style: const TextStyle(
                fontWeight: FontWeight.w600, fontSize: 14)),
      ],
    );
  }

  Widget _buildQuickActions() {
    final actions = [
      _QuickAction(Icons.call, 'Emergency\nCall', Colors.red, () {}),
      _QuickAction(Icons.sms, 'Send\nSMS', Colors.orange, () {}),
      _QuickAction(Icons.share_location, 'Share\nLocation', Colors.blue, () {}),
      _QuickAction(Icons.contacts, 'Emergency\nContacts', Colors.green, () {}),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Actions',
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.bold,
              ),
        ),
        const SizedBox(height: 12),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: actions.map((a) {
            return Expanded(
              child: GestureDetector(
                onTap: a.onTap,
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 4),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(
                    color: a.color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Column(
                    children: [
                      Icon(a.icon, color: a.color, size: 28),
                      const SizedBox(height: 8),
                      Text(
                        a.label,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: a.color,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
}

class _QuickAction {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  _QuickAction(this.icon, this.label, this.color, this.onTap);
}
