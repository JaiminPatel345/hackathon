import 'package:flutter/material.dart';
import 'package:frontend/components/my_textfield.dart';
import 'package:frontend/screens/Auth/mobile_verify.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:country_code_picker/country_code_picker.dart';
import '../../components/my_button.dart';
import '../../models/user_model.dart';
import '../../services/auth_service.dart';

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
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  // Country code state
  String _selectedCountryCode = '+91';

  // Auth service
  final ApiProvider _authService = ApiProvider();

  bool _isRegistering = false;
  bool _termsAccepted = true;
  String? _errorMessage;

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
    _usernameController.dispose();
    _mobileController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
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

  bool _validateForm() {
    // Reset error message
    setState(() {
      _errorMessage = null;
    });

    // Validate all required fields
    if (_nameController.text.isEmpty ||
        _usernameController.text.isEmpty ||
        _mobileController.text.isEmpty ||
        _passwordController.text.isEmpty ||
        _confirmPasswordController.text.isEmpty) {
      _showErrorSnackBar('Please fill in all fields');
      return false;
    }

    // Validate terms acceptance
    if (!_termsAccepted) {
      _showErrorSnackBar('Please accept the Terms of Service');
      return false;
    }

    // Validate username format (alphanumeric only)
    if (!RegExp(r'^[a-zA-Z0-9_]+$').hasMatch(_usernameController.text)) {
      _showErrorSnackBar(
        'Username can only contain letters, numbers, and underscores',
      );
      return false;
    }

    // Validate password strength
    final String password = _passwordController.text;
    if (password.length < 8) {
      _showErrorSnackBar('Password must be at least 8 characters long');
      return false;
    }

    // Check for uppercase letter
    if (!RegExp(r'[A-Z]').hasMatch(password)) {
      _showErrorSnackBar('Password must contain at least one uppercase letter');
      return false;
    }

    // Check for lowercase letter
    if (!RegExp(r'[a-z]').hasMatch(password)) {
      _showErrorSnackBar('Password must contain at least one lowercase letter');
      return false;
    }

    // Check for number
    if (!RegExp(r'[0-9]').hasMatch(password)) {
      _showErrorSnackBar('Password must contain at least one number');
      return false;
    }

    // Check for special character
    if (!RegExp(r'[!@#$%^&*()_\-+=<>?/\[\]{}]').hasMatch(password)) {
      _showErrorSnackBar(
        'Password must contain at least one special character',
      );
      return false;
    }

    // Validate passwords match
    if (_passwordController.text != _confirmPasswordController.text) {
      _showErrorSnackBar('Passwords do not match');
      return false;
    }

    // Validate mobile number format
    String mobileNumber = _mobileController.text.trim();
    if (!RegExp(r'^[0-9]{6,15}$').hasMatch(mobileNumber)) {
      _showErrorSnackBar('Please enter a valid mobile number');
      return false;
    }

    return true;
  }

  void _handleSignup() async {
    if (!_validateForm()) {
      return;
    }

    setState(() {
      _isRegistering = true;
    });

    try {
      String mobileNumber = _selectedCountryCode + _mobileController.text.trim();
      print("Mobile Number: $mobileNumber");

      final user = UserModel(
        name: _nameController.text.trim(),
        username: _usernameController.text.trim(),
        password: _passwordController.text,
        mobile: mobileNumber,
      );

      final registerResponse = await _authService.registerUser(user);
      print("Registration Response: ${registerResponse.success}");

      if (registerResponse.success) {
        if (mounted) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => OtpVerificationScreen(
                username: user.username,
                mobileNumber: mobileNumber,
                verificationType: OtpVerificationType.profileSetup,
              ),
            ),
          );
        }
      } else {
        _showErrorSnackBar(registerResponse.message);
      }
    } catch (e) {
      _showErrorSnackBar('Registration failed: ${e.toString()}');
    } finally {
      if (mounted) {
        setState(() {
          _isRegistering = false;
        });
      }
    }
  }


  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;

    return SafeArea(
      child: Scaffold(
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

                        const SizedBox(height: 40),

                        // Error message (if any)
                        if (_errorMessage != null) ...[
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.red.shade100,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              children: [
                                Icon(Icons.error_outline, color: Colors.red),
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

                        // Full Name TextField
                        MyTextfield(
                          hintText: 'Full Name',
                          obsText: false,
                          prefixIcon: Icons.person_outline,
                          accentColor: primaryColor,
                          controller: _nameController,
                          keyboardType: TextInputType.name,
                          isRequired: true,
                        ),

                        const SizedBox(height: 20),

                        // Username TextField
                        MyTextfield(
                          hintText: 'Username',
                          obsText: false,
                          prefixIcon: Icons.alternate_email,
                          accentColor: primaryColor,
                          controller: _usernameController,
                          keyboardType: TextInputType.text,
                          isRequired: true,
                        ),

                        const SizedBox(height: 20),

                        // Mobile Number TextField with Country Code Picker
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.grey.shade100,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Row(
                            children: [
                              // Country Code Picker
                              CountryCodePicker(
                                onChanged: (CountryCode countryCode) {
                                  setState(() {
                                    _selectedCountryCode =
                                        countryCode.dialCode ?? '+91';
                                  });
                                },
                                initialSelection: 'IN',
                                favorite: const ['IN', 'US', 'GB', 'CA', 'AU'],
                                showCountryOnly: false,
                                showOnlyCountryWhenClosed: false,
                                alignLeft: false,
                                padding: const EdgeInsets.all(8),
                                textStyle: GoogleFonts.poppins(
                                  fontSize: 16,
                                  color: Colors.black87,
                                ),
                              ),

                              // Vertical divider
                              Container(
                                height: 30,
                                width: 1,
                                color: Colors.grey.shade300,
                              ),

                              // Mobile number input field
                              Expanded(
                                child: TextField(
                                  controller: _mobileController,
                                  keyboardType: TextInputType.phone,
                                  style: GoogleFonts.poppins(
                                    fontSize: 16,
                                    color: Colors.black87,
                                  ),
                                  decoration: InputDecoration(
                                    hintText: 'Mobile Number *',
                                    hintStyle: TextStyle(
                                      color: Colors.grey.shade500,
                                    ),
                                    border: InputBorder.none,
                                    contentPadding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 16,
                                    ),
                                    isDense: true,
                                    prefixIcon: Icon(
                                      Icons.phone_android_outlined,
                                      color: primaryColor,
                                      size: 20,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Password TextField
                        MyTextfield(
                          hintText: 'Password',
                          obsText: true,
                          prefixIcon: Icons.lock_outline,
                          accentColor: primaryColor,
                          controller: _passwordController,
                          isRequired: true,
                        ),

                        const SizedBox(height: 8),

                        // Password requirements
                        Padding(
                          padding: const EdgeInsets.only(left: 12),
                          child: Text(
                            "Password must contain at least 8 characters, including uppercase, lowercase, number and special character",
                            style: GoogleFonts.poppins(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Confirm Password TextField
                        MyTextfield(
                          hintText: 'Confirm Password',
                          obsText: true,
                          prefixIcon: Icons.lock_outline,
                          accentColor: primaryColor,
                          controller: _confirmPasswordController,
                          isRequired: true,
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
                          text: "Sign Up",
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
      ),
    );
  }
}
