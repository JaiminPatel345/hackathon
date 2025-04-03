import 'dart:async';
import 'package:flutter/material.dart';
import 'package:frontend/screens/profile_setup.dart';
import 'package:frontend/services/token_service.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import '../../components/my_button.dart';
import '../../services/auth_service.dart';

enum OtpVerificationType { passwordReset, profileSetup }

class OtpVerificationScreen extends StatefulWidget {
  final String username;
  final String mobileNumber;
  final OtpVerificationType verificationType;

  const OtpVerificationScreen({
    super.key,
    required this.mobileNumber,
    required this.verificationType,
    required this.username,
  });

  @override
  State<OtpVerificationScreen> createState() => _OtpVerificationScreenState();
}

class _OtpVerificationScreenState extends State<OtpVerificationScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final TextEditingController _otpController = TextEditingController();
  final ApiProvider _authService = ApiProvider();

  bool _isSubmitting = false;

  // Timer for resending OTP
  Timer? _timer;
  int _remainingTime = 60;
  bool _canResend = false;

  @override
  void initState() {
    super.initState();
    // Set up animations
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutCubic),
    );

    // Start animations when screen loads
    _animationController.forward();

    // Start countdown timer
    _startTimer();
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        if (_remainingTime > 0) {
          _remainingTime--;
        } else {
          _canResend = true;
          _timer?.cancel();
        }
      });
    });
  }

  @override
  void dispose() {
    _animationController.dispose();
    _otpController.dispose();
    _timer?.cancel();
    super.dispose();
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

  Future<void> _resendOtp() async {
    if (!_canResend) return;

    setState(() {
      _isSubmitting = true;
      _canResend = false;
      _remainingTime = 60;
    });

    try {
      final response = await _authService.sendOtp(widget.mobileNumber);

      if (response.success) {
        _showSuccessSnackBar('OTP resent successfully');
        _startTimer();
      } else {
        _showErrorSnackBar(response.message);
        setState(() {
          _canResend = true;
        });
      }
    } catch (e) {
      _showErrorSnackBar('Failed to resend OTP: ${e.toString()}');
      setState(() {
        _canResend = true;
      });
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  // In OtpVerificationScreen.dart, update the _submitOtp method:

  Future<void> _submitOtp() async {
    if (_otpController.text.length != 4) {
      _showErrorSnackBar('Please enter a valid 4-digit OTP');
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final response = await _authService.verifyOtp(
          widget.username,
          _otpController.text
      );

      print("OTP verification response: ${response.success}");

      if (response.success) {
        if (widget.verificationType == OtpVerificationType.passwordReset) {
          // Password reset flow...
        } else {
          // Extract and validate user ID
          final String userId = response.data['user']?['_id'] ?? '';
          print("User ID from response: $userId");

          if (userId.isEmpty) {
            _showErrorSnackBar('User ID not found in response');
            return;
          }

          // Extract and validate token
          final String authToken = response.data['token'] ?? '';
          print("Auth token from response: ${authToken.isNotEmpty ? 'PRESENT' : 'EMPTY'}");

          if (authToken.isEmpty) {
            _showErrorSnackBar('Authentication token not found in response');
            return;
          }

          // Store token
          final tokenService = TokenService();
          await tokenService.deleteToken(); // Clear any existing token
          await tokenService.storeToken(authToken);

          // Verify token was stored
          final hasToken = await tokenService.hasToken();
          print("Token stored successfully: $hasToken");

          if (!hasToken) {
            _showErrorSnackBar('Failed to store authentication token');
            return;
          }

          // Navigate to profile setup
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => ProfileSetup(
                userId: userId,
              ),
            ),
          );
        }
      } else {
        _showErrorSnackBar(response.message);
      }
    } catch (e) {
      print("OTP verification error: $e");
      _showErrorSnackBar('Something went wrong: ${e.toString()}');
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.transparent,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: Theme.of(context).primaryColor,
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 24.0),
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    const SizedBox(height: 20),
                    Icon(Icons.verified_user_rounded, size: 100,),
                    const SizedBox(height: 30),
                    Text(
                      'OTP Verification',
                      style: GoogleFonts.poppins(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'We sent a verification code to',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'is ${widget.mobileNumber}',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 30),
                    PinCodeTextField(
                      appContext: context,
                      length: 4, // Change this from 6 to 4
                      obscureText: false,
                      animationType: AnimationType.fade,
                      pinTheme: PinTheme(
                        shape: PinCodeFieldShape.box,
                        borderRadius: BorderRadius.circular(8),
                        fieldHeight: 70,
                        fieldWidth: 70,
                        activeFillColor: Colors.white,
                        inactiveFillColor: Colors.grey[100],
                        selectedFillColor: Colors.white,
                        activeColor: Theme.of(context).primaryColor,
                        inactiveColor: Colors.grey[300],
                      ),
                      animationDuration: const Duration(milliseconds: 300),
                      enableActiveFill: true,
                      controller: _otpController,
                      onCompleted: (_) {
                        _submitOtp(); // Auto-submit when all 4 digits are filled
                      },
                      onChanged: (value) {
                        setState(() {}); // Update UI on change
                      },
                    ),
                    const SizedBox(height: 30),
                    MyButton(
                      text: 'Submit',
                      onTap: _submitOtp,
                      isLoading: _isSubmitting,
                    ),
                    const SizedBox(height: 24),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          "Didn't receive code? ",
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                        TextButton(
                          onPressed: _canResend ? _resendOtp : null,
                          child: Text(
                            _canResend
                                ? 'Resend'
                                : 'Resend in $_remainingTime seconds',
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: _canResend
                                  ? Theme.of(context).primaryColor
                                  : Colors.grey,
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
        ),
      ),
    );
  }
}