// lib/screens/Auth/mobile_verify.dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../components/my_button.dart';
import '../../providers/auth_notifier.dart';
import '../../services/auth_service.dart';
import '../home_screen.dart';

enum OtpVerificationType { profileSetup, passwordReset }

class OtpVerificationScreen extends ConsumerStatefulWidget {
  final String mobileNumber;
  final OtpVerificationType verificationType;
  final String? username;

  const OtpVerificationScreen({
    super.key,
    required this.mobileNumber,
    required this.verificationType,
    this.username,
  });

  @override
  ConsumerState<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends ConsumerState<OtpVerificationScreen> {
  final TextEditingController _otpController = TextEditingController();
  Timer? _timer;
  int _secondsRemaining = 60;
  bool _isResending = false;
  bool _isVerifying = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    startTimer();
  }

  @override
  void dispose() {
    _otpController.dispose();
    _timer?.cancel();
    super.dispose();
  }

  void startTimer() {
    setState(() {
      _secondsRemaining = 60;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining == 0) {
        timer.cancel();
      } else {
        setState(() {
          _secondsRemaining--;
        });
      }
    });
  }

  Future<void> _resendOtp() async {
    if (_isResending || _secondsRemaining > 0) return;

    setState(() {
      _isResending = true;
      _errorMessage = null;
    });

    try {
      final AuthService authService = ref.read(authRepositoryProvider);
      final response = await authService.sendOtp(widget.mobileNumber);

      if (response.success) {
        _showSuccessSnackBar('OTP resent successfully!');
        startTimer();
      } else {
        setState(() {
          _errorMessage = response.message;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to resend OTP: ${e.toString()}';
      });
    } finally {
      setState(() {
        _isResending = false;
      });
    }
  }

  Future<void> _verifyOtp() async {
    if (_otpController.text.length != 4) {
      _showErrorSnackBar('Please enter a valid 4-digit OTP');
      return;
    }

    setState(() {
      _isVerifying = true;
      _errorMessage = null;
    });

    try {
      final authNotifier = ref.read(authNotifierProvider.notifier);
      final username = widget.username ?? '';

      final success = await authNotifier.verifyOtp(username, _otpController.text);

      if (success && mounted) {
        // Navigate based on verification type
        if (widget.verificationType == OtpVerificationType.profileSetup) {
          Navigator.pushAndRemoveUntil(
            context,
            MaterialPageRoute(builder: (context) => const HomeScreen()),
                (route) => false,
          );
        } else {
          // For password reset, you would navigate to reset password screen
          Navigator.pop(context, true);
        }
      } else if (mounted) {
        setState(() {
          _errorMessage = ref.read(authNotifierProvider).errorMessage;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Verification failed: ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isVerifying = false;
        });
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _showSuccessSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          "Verify OTP",
          style: GoogleFonts.poppins(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Colors.white, Colors.grey.shade100],
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 20),

                // OTP icon
                Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: primaryColor.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.message,
                    size: 40,
                    color: primaryColor,
                  ),
                ),

                const SizedBox(height: 30),

                // Title
                Text(
                  "OTP Verification",
                  style: GoogleFonts.poppins(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),

                const SizedBox(height: 16),

                // Subtitle with mobile number
                Text(
                  "We've sent a verification code to",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    color: Colors.black54,
                  ),
                ),

                const SizedBox(height: 8),

                // Mobile number
                Text(
                  widget.mobileNumber,
                  style: GoogleFonts.poppins(
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),

                const SizedBox(height: 40),

                // Error message if any
                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: Colors.red),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            _errorMessage!,
                            style: GoogleFonts.poppins(
                              color: Colors.red,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // OTP input fields
                PinCodeTextField(
                  appContext: context,
                  length: 4,
                  controller: _otpController,
                  animationType: AnimationType.fade,
                  pinTheme: PinTheme(
                    shape: PinCodeFieldShape.box,
                    borderRadius: BorderRadius.circular(12),
                    fieldHeight: 60,
                    fieldWidth: 60,
                    activeFillColor: Colors.white,
                    inactiveFillColor: Colors.white,
                    selectedFillColor: Colors.white,
                    activeColor: primaryColor,
                    inactiveColor: Colors.grey.shade300,
                    selectedColor: primaryColor,
                  ),
                  keyboardType: TextInputType.number,
                  animationDuration: const Duration(milliseconds: 300),
                  enableActiveFill: true,
                  onCompleted: (v) {
                    // Auto verify when 4 digits are entered
                    _verifyOtp();
                  },
                  onChanged: (value) {
                    // You can handle changes here if needed
                  },
                ),

                const SizedBox(height: 30),

                // Verify button
                MyButton(
                  text: "Verify OTP",
                  onTap: _verifyOtp,
                  accentColor: primaryColor,
                  isLoading: _isVerifying,
                  icon: Icons.verified_user,
                ),

                const SizedBox(height: 24),

                // Timer and resend option
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Didn't receive code? ",
                      style: GoogleFonts.poppins(color: Colors.black54),
                    ),
                    _secondsRemaining > 0
                        ? Text(
                      "Resend in $_secondsRemaining seconds",
                      style: GoogleFonts.poppins(
                        color: Colors.black87,
                        fontWeight: FontWeight.w500,
                      ),
                    )
                        : TextButton(
                      onPressed: _resendOtp,
                      style: TextButton.styleFrom(
                        padding: EdgeInsets.zero,
                        minimumSize: const Size(50, 30),
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: Text(
                        "Resend OTP",
                        style: GoogleFonts.poppins(
                          color: primaryColor,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}