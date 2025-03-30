import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:frontend/components/my_button.dart';
import 'package:frontend/screens/Auth/profile_setup.dart';

import 'new_password_screen.dart';

enum OtpVerificationType {
  profileSetup,
  passwordReset,
}

class OtpVerificationScreen extends StatefulWidget {
  final String mobileNumber;
  final OtpVerificationType verificationType;
  final VoidCallback? onVerificationSuccess;

  const OtpVerificationScreen({
    super.key,
    required this.mobileNumber,
    required this.verificationType,
    this.onVerificationSuccess,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen> {
  final List<TextEditingController> _otpControllers =
  List.generate(4, (index) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(4, (index) => FocusNode());
  final List<String> _previousTexts = List.filled(4, "");

  bool _isResendEnabled = true;
  int _resendCountdown = 30;
  Timer? _resendTimer;
  bool _showResendSuccess = false;
  bool _isVerifying = false;

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

  String get _screenTitle {
    return widget.verificationType == OtpVerificationType.profileSetup
        ? 'Verify Mobile'
        : 'Reset Password';
  }

  String get _verificationButtonText {
    return widget.verificationType == OtpVerificationType.profileSetup
        ? 'Create Account'
        : 'Reset Password';
  }

  Future<void> _verifyOtp() async {
    final otp = _otpControllers.map((c) => c.text).join();
    if (otp.length != 4) return;

    setState(() => _isVerifying = true);

    try {
      // TODO: Implement actual OTP verification
      await Future.delayed(const Duration(seconds: 1)); // Simulate API call

      if (widget.onVerificationSuccess != null) {
        widget.onVerificationSuccess!();
      } else {
        _navigateAfterVerification();
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Verification failed: ${e.toString()}')),
      );
    } finally {
      if (mounted) setState(() => _isVerifying = false);
    }
  }

  void _navigateAfterVerification() {
    switch (widget.verificationType) {
      case OtpVerificationType.profileSetup:
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const ProfileSetup()),
        );
        break;
      case OtpVerificationType.passwordReset:
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (context) => NewPasswordScreen(phone: widget.mobileNumber),
          ),
        );
        break;
    }
  }

  void _resendCode() {
    if (!_isResendEnabled) return;

    // TODO: Implement resend logic
    setState(() {
      _showResendSuccess = true;
      _isResendEnabled = false;
      _resendCountdown = 60;
    });

    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) setState(() => _showResendSuccess = false);
    });

    _resendTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_resendCountdown <= 0) {
        timer.cancel();
        if (mounted) setState(() => _isResendEnabled = true);
      } else if (mounted) {
        setState(() => _resendCountdown--);
      }
    });
  }

  Widget _buildOtpInputField(int index) {
    return SizedBox(
      width: 64,
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
            borderSide: const BorderSide(color: Color(0xFF6750A4), width: 2),
          ),
        ),
        inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        onChanged: (value) {
          bool isBackspace = value.isEmpty && _previousTexts[index].isNotEmpty;
          _previousTexts[index] = value;

          if (value.isNotEmpty && index < 3) {
            _focusNodes[index + 1].requestFocus();
          } else if (isBackspace && index > 0) {
            _focusNodes[index - 1].requestFocus();
          }
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        backgroundColor: Colors.grey[50],
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back),
                onPressed: () => Navigator.pop(context),
              ),
              const SizedBox(height: 24),
              Text(
                _screenTitle,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Enter the code sent to ${widget.mobileNumber}',
                style: TextStyle(color: Colors.grey[700]),
              ),
              const SizedBox(height: 48),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: List.generate(4, (index) => _buildOtpInputField(index)),
              ),
              if (_showResendSuccess) ...[
                const SizedBox(height: 24),
                Center(
                  child: Text(
                    'Code resent successfully!',
                    style: TextStyle(color: Colors.green[700]),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              Center(
                child: TextButton(
                  onPressed: _isResendEnabled ? _resendCode : null,
                  child: Text(
                    _isResendEnabled
                        ? 'Resend Code'
                        : 'Resend in $_resendCountdown seconds',
                  ),
                ),
              ),
              const SizedBox(height: 48),
              MyButton(text: _verificationButtonText, onTap: ( ){
                _isVerifying ? const CircularProgressIndicator(color: Colors.white) : _verifyOtp();
              })
              // SizedBox(
              //   width: double.infinity,
              //   child: ElevatedButton(
              //     onPressed: _isVerifying ? null : _verifyOtp,
              //     style: ElevatedButton.styleFrom(
              //       backgroundColor: const Color(0xFF6750A4),
              //       padding: const EdgeInsets.symmetric(vertical: 16),
              //     ),
              //     child: _isVerifying
              //         ? const CircularProgressIndicator(color: Colors.white)
              //         : Text(_verificationButtonText),
              //   ),
              // ),
            ],
          ),
        ),
      ),
    );
  }
}