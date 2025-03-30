import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class OtpVerificationScreen extends StatefulWidget {
  final String mobileNumber;

  const OtpVerificationScreen({super.key, required this.mobileNumber});

  @override
  _OtpVerificationScreenState createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final List<TextEditingController> _otpControllers = List.generate(
    4,
        (index) => TextEditingController(),
  );
  final List<FocusNode> _focusNodes = List.generate(4, (index) => FocusNode());
  final List<String> _previousTexts = List.generate(4, (index) => "");

  // Resend feature variables
  bool _isResendEnabled = true;
  int _resendCountdown = 30; // 30 seconds countdown
  Timer? _resendTimer;
  bool _showResendSuccess = false;

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    for (var controller in _otpControllers) {
      controller.dispose();
    }
    for (var node in _focusNodes) {
      node.dispose();
    }
    _resendTimer?.cancel();
    super.dispose();
  }

  void _verifyOtp() {
    // Get the complete OTP
    final otp = _otpControllers.map((controller) => controller.text).join();

    // TODO: Implement your OTP verification logic here
    if (kDebugMode) {
      print('Verifying OTP: $otp');
    }

    // Navigate to the next screen after verification
    // Navigator.of(context).pushReplacement(
    //   MaterialPageRoute(builder: (context) => HomeScreen()),
    // );
  }

  void _resendCode() {
    if (!_isResendEnabled) return;

    // TODO: Implement actual resend code logic here
    if (kDebugMode) {
      print('Resending code to ${widget.mobileNumber}');
    }

    // Show success message
    setState(() {
      _showResendSuccess = true;
      _isResendEnabled = false;
      _resendCountdown = 60;
    });

    // Hide success message after 3 seconds
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _showResendSuccess = false;
        });
      }
    });

    // Start countdown timer
    _resendTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendCountdown <= 0) {
        timer.cancel();
        if (mounted) {
          setState(() {
            _isResendEnabled = true;
          });
        }
      } else {
        if (mounted) {
          setState(() {
            _resendCountdown--;
          });
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back button
                IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.black),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () => Navigator.pop(context),
                ),
                const SizedBox(height: 24),

                // Title
                const Text(
                  'Verify Mobile',
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),

                const SizedBox(height: 12),

                // Subtitle
                Text(
                  'Enter the code sent to ${widget.mobileNumber}',
                  style: TextStyle(fontSize: 16, color: Colors.grey[700]),
                ),

                const SizedBox(height: 48),

                // OTP input fields
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: List.generate(
                    4,
                        (index) => SizedBox(
                      width: 70,
                      child: TextField(
                        controller: _otpControllers[index],
                        focusNode: _focusNodes[index],
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 24),
                        maxLength: 1,
                        decoration: InputDecoration(
                          counterText: '',
                          filled: true,
                          fillColor: Colors.white,
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: BorderSide(color: Colors.grey[300]!),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                            borderSide: const BorderSide(
                              color: Color(0xFF6750A4),
                              width: 2,
                            ),
                          ),
                        ),
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                        ],
                        onChanged: (value) {
                          // Check if text was deleted (backspace was pressed)
                          bool isBackspace = value.isEmpty && _previousTexts[index].isNotEmpty;
                          _previousTexts[index] = value;

                          if (value.isNotEmpty && index < 3) {
                            // Forward navigation - filled input
                            _focusNodes[index + 1].requestFocus();
                          } else if (isBackspace && index > 0) {
                            // Backward navigation - deleted input
                            _focusNodes[index - 1].requestFocus();
                          }
                        },
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Resend success message
                if (_showResendSuccess)
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                      decoration: BoxDecoration(
                        color: Colors.green[50],
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(color: Colors.green[300]!),
                      ),
                      child: Text(
                        'OTP code resent successfully!',
                        style: TextStyle(color: Colors.green[700], fontWeight: FontWeight.w500),
                      ),
                    ),
                  ),

                const SizedBox(height: 16),

                // Resend code text with timer
                Center(
                  child: TextButton(
                    onPressed: _isResendEnabled ? _resendCode : null,
                    style: TextButton.styleFrom(
                      foregroundColor: _isResendEnabled
                          ? const Color(0xFF6750A4)
                          : Colors.grey[400],
                    ),
                    child: Text(
                      _isResendEnabled
                          ? 'Resend Code'
                          : 'Resend Code (${_resendCountdown}s)',
                      style: TextStyle(
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 48),

                // Verify button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: _verifyOtp,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6750A4),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                    ),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Verify', style: TextStyle(fontSize: 16)),
                        SizedBox(width: 8),
                        Icon(Icons.arrow_forward, color: Colors.white),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// This shows how to navigate to the OTP screen after account creation
class NavigationExample {
  void navigateToOtpScreen(BuildContext context, String mobileNumber) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => OtpVerificationScreen(mobileNumber: mobileNumber),
      ),
    );
  }
}