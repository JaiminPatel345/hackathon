import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:frontend/components/my_textfield.dart';
import 'package:frontend/screens/Auth/forgot_password_screen.dart';
import 'package:frontend/screens/Auth/signup_screen.dart';
import 'package:frontend/screens/home_screen.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:country_code_picker/country_code_picker.dart';
import '../../components/my_button.dart';
import '../../providers/api_provider.dart';

enum LoginMethod { username, mobileNumber }

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // Added controllers and variables for the new features
  LoginMethod _loginMethod = LoginMethod.username;
  final TextEditingController _mobileNumberController = TextEditingController();
  String _selectedCountryCode = '+1'; // Default country code

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
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _passwordController.dispose();
    _mobileNumberController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    // Basic validation based on selected login method
    if (_loginMethod == LoginMethod.username) {
      if (_usernameController.text.isEmpty || _passwordController.text.isEmpty) {
        _showValidationError('Please fill in all fields');
        return;
      }
    } else {
      if (_mobileNumberController.text.isEmpty || _passwordController.text.isEmpty) {
        _showValidationError('Please fill in all fields');
        return;
      }
    }

    if (mounted) {
      // Navigate to home screen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => const HomeScreen()),
      );
    } else if (mounted) {
      // Show error message
      final errorMessage = ref.read(authNotifierProvider).errorMessage;
      _showValidationError(errorMessage ?? 'Login failed');
    }
  }

  void _showValidationError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Widget _buildLoginMethodSelector() {
    final primaryColor = Theme.of(context).primaryColor;

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 15),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 3,
            offset: const Offset(0, 1),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Login with:",
            style: GoogleFonts.poppins(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: RadioListTile<LoginMethod>(
                  title: Text(
                    'Username',
                    style: GoogleFonts.poppins(fontSize: 14),
                  ),
                  value: LoginMethod.username,
                  groupValue: _loginMethod,
                  activeColor: primaryColor,
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  onChanged: (LoginMethod? value) {
                    setState(() {
                      _loginMethod = value!;
                    });
                  },
                ),
              ),
              Expanded(
                child: RadioListTile<LoginMethod>(
                  title: Text(
                    'Mobile',
                    style: GoogleFonts.poppins(fontSize: 14),
                  ),
                  value: LoginMethod.mobileNumber,
                  groupValue: _loginMethod,
                  activeColor: primaryColor,
                  contentPadding: EdgeInsets.zero,
                  dense: true,
                  onChanged: (LoginMethod? value) {
                    setState(() {
                      _loginMethod = value!;
                    });
                  },
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLoginField() {
    final primaryColor = Theme.of(context).primaryColor;

    if (_loginMethod == LoginMethod.username) {
      return MyTextfield(
        controller: _usernameController,
        hintText: 'Username',
        obsText: false,
        prefixIcon: Icons.person_outline,
        accentColor: primaryColor,
        isRequired: true,
      );
    } else {
      return Row(
        children: [
          // Country code picker
          Container(
            height: 60,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.grey.shade300),
            ),
            child: CountryCodePicker(
              onChanged: (CountryCode countryCode) {
                setState(() {
                  _selectedCountryCode = countryCode.dialCode!;
                });
              },
              initialSelection: 'US',
              favorite: const ['US', 'CA', 'GB', 'IN'],
              showCountryOnly: false,
              showOnlyCountryWhenClosed: false,
              alignLeft: false,
              padding: const EdgeInsets.symmetric(horizontal: 8),
              textStyle: GoogleFonts.poppins(
                fontSize: 14,
                color: Colors.black87,
              ),
              dialogTextStyle: GoogleFonts.poppins(
                fontSize: 14,
                color: Colors.black87,
              ),
              searchStyle: GoogleFonts.poppins(
                fontSize: 14,
                color: Colors.black87,
              ),
              dialogSize: Size(MediaQuery.of(context).size.width * 0.8,
                  MediaQuery.of(context).size.height * 0.8),
              searchDecoration: InputDecoration(
                hintText: 'Search country',
                hintStyle: GoogleFonts.poppins(
                  fontSize: 14,
                  color: Colors.grey,
                ),
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: primaryColor),
                ),
              ),
            ),
          ),

          const SizedBox(width: 10),

          // Mobile number field
          Expanded(
            child: MyTextfield(
              controller: _mobileNumberController,
              hintText: 'Mobile Number',
              obsText: false,
              prefixIcon: Icons.phone_outlined,
              accentColor: primaryColor,
              isRequired: true,
              keyboardType: TextInputType.phone,
            ),
          ),
        ],
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = Theme.of(context).primaryColor;
    final screenHeight = MediaQuery.of(context).size.height;

    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: true,
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
              child: SizedBox(
                height:
                screenHeight -
                    MediaQuery.of(context).padding.top -
                    MediaQuery.of(context).padding.bottom,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 25),
                  child: FadeTransition(
                    opacity: _fadeAnimation,
                    child: SlideTransition(
                      position: _slideAnimation,
                      child: Column(
                        children: [
                          SizedBox(height: screenHeight * 0.1),

                          // Logo or app icon
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              color: primaryColor.withOpacity(0.9),
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: primaryColor.withOpacity(0.3),
                                  blurRadius: 15,
                                  offset: const Offset(0, 5),
                                ),
                              ],
                            ),
                            child: const Icon(
                              Icons.lock_outline_rounded,
                              color: Colors.white,
                              size: 40,
                            ),
                          ),

                          const SizedBox(height: 24),

                          // Title
                          Text(
                            "Welcome Back",
                            style: GoogleFonts.poppins(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),

                          const SizedBox(height: 8),

                          // Subtitle
                          Text(
                            "Sign in to continue",
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              color: Colors.black54,
                            ),
                          ),

                          SizedBox(height: screenHeight * 0.05),

                          // Login method selector (Radio buttons)
                          _buildLoginMethodSelector(),

                          const SizedBox(height: 20),

                          // Username/Mobile field based on selection
                          _buildLoginField(),

                          const SizedBox(height: 20),

                          // Password TextField
                          MyTextfield(
                            controller: _passwordController,
                            hintText: 'Password',
                            obsText: true,
                            prefixIcon: Icons.lock_outline,
                            accentColor: primaryColor,
                            isRequired: true,
                          ),

                          const SizedBox(height: 12),

                          // Forgot Password
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder:
                                        (context) => const ForgotPasswordScreen(),
                                  ),
                                );
                              },
                              style: TextButton.styleFrom(
                                padding: EdgeInsets.zero,
                                minimumSize: const Size(50, 30),
                              ),
                              child: Text(
                                "Forgot Password?",
                                style: GoogleFonts.poppins(
                                  fontSize: 14,
                                  color: primaryColor,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(height: 30),

                          // Login Button
                          MyButton(
                            text: "Log In",
                            onTap: _handleLogin,
                            accentColor: primaryColor,
                            isLoading: ref.watch(authNotifierProvider).isLoading,
                          ),

                          const Spacer(),

                          // Sign Up option
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                "Don't have an account?",
                                style: GoogleFonts.poppins(color: Colors.black54),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => const SignupScreen(),
                                    ),
                                  );
                                },
                                child: Text(
                                  "Sign Up",
                                  style: GoogleFonts.poppins(
                                    color: primaryColor,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),

                          const SizedBox(height: 16),
                        ],
                      ),
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