import 'package:flutter/material.dart';
import 'package:frontend/components/my_textfield.dart';
import 'package:frontend/screens/mobile_verify.dart';
import 'package:google_fonts/google_fonts.dart';
import '../components/my_button.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  // Text controllers for form fields
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _isRegistering = false;
  bool _termsAccepted = true;

  @override
  void initState() {
    super.initState();

    // Set up animations
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    // Initialize fade animation
    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOut),
    );

    // Initialize slide animation
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.2),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeOutCubic),
    );

    // Start animations when screen loads
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    _nameController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleSignup() {
    // Basic validation
    if (_nameController.text.isEmpty ||
        _mobileController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill in all fields'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }

    if (!_termsAccepted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please accept the Terms of Service'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() {
      _isRegistering = true;
    });

    // Simulate signup process
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted) {
        setState(() {
          _isRegistering = false;
        });

        // Here you would navigate to the next screen after successful registration
        Navigator.push(
          context,
          MaterialPageRoute(
            builder:
                (context) => OtpVerificationScreen(mobileNumber: '9313343975'),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;

    return Scaffold(
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_ios_new, color: Colors.black87),
          onPressed: () => Navigator.pop(context),
        ),
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
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 25),
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: SlideTransition(
                  position: _slideAnimation,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 20),

                      // Title
                      Text(
                        "Create Account",
                        style: GoogleFonts.poppins(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),

                      const SizedBox(height: 8),

                      // Subtitle
                      Text(
                        "Sign up to get started",
                        style: GoogleFonts.poppins(
                          fontSize: 16,
                          color: Colors.black54,
                        ),
                      ),

                      const SizedBox(height: 40),

                      // Full Name TextField
                      MyTextfield(
                        hintText: 'Full Name',
                        obsText: false,
                        prefixIcon: Icons.person_outline,
                        accentColor: primaryColor,
                        controller: _nameController,
                        keyboardType: TextInputType.name,
                      ),

                      const SizedBox(height: 20),

                      // Mobile Number TextField
                      MyTextfield(
                        hintText: 'Mobile Number',
                        obsText: false,
                        prefixIcon: Icons.phone_android_outlined,
                        accentColor: primaryColor,
                        controller: _mobileController,
                        keyboardType: TextInputType.phone,
                      ),

                      const SizedBox(height: 20),

                      // Email TextField
                      MyTextfield(
                        hintText: 'Email Address',
                        obsText: false,
                        prefixIcon: Icons.email_outlined,
                        accentColor: primaryColor,
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                      ),

                      const SizedBox(height: 20),

                      // Password TextField with toggle visibility
                      MyTextfield(
                        hintText: 'Password',
                        obsText: true,
                        // This will trigger the eye icon
                        prefixIcon: Icons.lock_outline,
                        accentColor: primaryColor,
                        controller: _passwordController,
                      ),

                      const SizedBox(height: 40),

                      // Privacy Policy & Terms
                      Row(
                        children: [
                          SizedBox(
                            width: 24,
                            height: 24,
                            child: Checkbox(
                              value: _termsAccepted,
                              onChanged: (value) {
                                setState(() {
                                  _termsAccepted = value ?? true;
                                });
                              },
                              activeColor: primaryColor,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              "I agree to the Terms of Service and Privacy Policy",
                              style: GoogleFonts.poppins(
                                fontSize: 14,
                                color: Colors.black54,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 30),

                      // Sign Up Button
                      MyButton(
                        text: "Create Account",
                        onTap: _handleSignup,
                        accentColor: primaryColor,
                        isLoading: _isRegistering,
                        icon: Icons.arrow_forward,
                      ),

                      const SizedBox(height: 30),

                      // Login option
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            "Already have an account?",
                            style: GoogleFonts.poppins(color: Colors.black54),
                          ),
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: Text(
                              "Login",
                              style: GoogleFonts.poppins(
                                color: primaryColor,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
