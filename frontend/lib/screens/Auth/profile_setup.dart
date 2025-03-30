import 'dart:io';
import 'package:flutter/material.dart';
import 'package:frontend/screens/home_screen.dart' show HomeScreen;
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../../components/my_button.dart';
import '../../components/my_textfield.dart';

class ProfileSetup extends StatefulWidget {
  const ProfileSetup({super.key});

  @override
  State<ProfileSetup> createState() => _ProfileSetupState();
}

class _ProfileSetupState extends State<ProfileSetup> with SingleTickerProviderStateMixin {
  // Animation controllers
  late AnimationController _animationController;
  Animation<double>? _fadeAnimation;
  Animation<Offset>? _slideAnimation;

  // Form controllers
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _targetController = TextEditingController();
  final TextEditingController _yearController = TextEditingController();
  final TextEditingController _interestController = TextEditingController();

  // Image picker
  File? _profileImage;
  final ImagePicker _picker = ImagePicker();

  // Level selection
  final List<String> _levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  String? _selectedLevel;

  // Interests selection
  final List<String> _availableInterests = [
    'Physics', 'Chemistry', 'Mathematics', 'Biology',
    'Computer Science', 'DSA', 'Machine Learning',
    'Electronics', 'Mechanics', 'Thermodynamics'
  ];
  final List<String> _selectedInterests = [];
  final FocusNode _interestFocusNode = FocusNode();

  // Loading state
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();

    // Set up animations controller first
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1200),
      vsync: this,
    );

    // Initialize animations AFTER controller is set up
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

  // Add interest tag
  void _addInterest(String interest) {
    if (interest.isNotEmpty && !_selectedInterests.contains(interest)) {
      setState(() {
        _selectedInterests.add(interest);
        _interestController.clear();
      });
    }
  }

  // Remove interest tag
  void _removeInterest(String interest) {
    setState(() {
      _selectedInterests.remove(interest);
    });
  }

  // Pick image from gallery or camera
  Future<void> _pickImage(ImageSource source) async {
    try {
      final XFile? pickedFile = await _picker.pickImage(source: source);
      if (pickedFile != null) {
        setState(() {
          _profileImage = File(pickedFile.path);
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error picking image: $e'),
          backgroundColor: Colors.red,
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  // Show image source dialog
  void _showImageSourceDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(
          'Choose Image Source',
          style: GoogleFonts.poppins(fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ListTile(
              leading: const Icon(Icons.photo_library),
              title: Text('Gallery', style: GoogleFonts.poppins()),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.gallery);
              },
            ),
            ListTile(
              leading: const Icon(Icons.camera_alt),
              title: Text('Camera', style: GoogleFonts.poppins()),
              onTap: () {
                Navigator.pop(context);
                _pickImage(ImageSource.camera);
              },
            ),
          ],
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
      ),
    );
  }

  // Save profile data
  void _saveProfile() {
    if (_formKey.currentState!.validate()) {
      if (_profileImage == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please upload a profile image'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
        return;
      }

      if (_selectedLevel == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please select your level'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
        return;
      }

      if (_selectedInterests.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Please select at least one interest'),
            backgroundColor: Colors.red,
            behavior: SnackBarBehavior.floating,
          ),
        );
        return;
      }

      setState(() {
        _isSaving = true;
      });

      // Simulate saving profile
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) {
          setState(() {
            _isSaving = false;
          });

          // TODO: Save profile data to database or state management

          // Show success message
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile setup completed successfully!'),
              backgroundColor: Colors.green,
              behavior: SnackBarBehavior.floating,
            ),
          );

          // Navigate to next screen
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(builder: (context) => HomeScreen()),
          );
        }
      });
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    _titleController.dispose();
    _targetController.dispose();
    _yearController.dispose();
    _interestController.dispose();
    _interestFocusNode.dispose();
    super.dispose();
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
                  opacity: _fadeAnimation ?? const AlwaysStoppedAnimation(1.0),
                  child: SlideTransition(
                    position: _slideAnimation ?? const AlwaysStoppedAnimation(Offset.zero),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 20),
      
                          // Title
                          Text(
                            "Profile Setup",
                            style: GoogleFonts.poppins(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
      
                          const SizedBox(height: 8),
      
                          // Subtitle
                          Text(
                            "Set up your profile to get a personalized experience",
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              color: Colors.black54,
                            ),
                          ),
      
                          const SizedBox(height: 40),
      
                          // Profile Image
                          Center(
                            child: Stack(
                              children: [
                                // Profile image
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                    color: Colors.grey[200],
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: primaryColor,
                                      width: 2,
                                    ),
                                    image: _profileImage != null
                                        ? DecorationImage(
                                      image: FileImage(_profileImage!),
                                      fit: BoxFit.cover,
                                    )
                                        : null,
                                  ),
                                  child: _profileImage == null
                                      ? const Icon(
                                    Icons.person,
                                    size: 60,
                                    color: Colors.grey,
                                  )
                                      : null,
                                ),
                                // Edit button
                                Positioned(
                                  right: 0,
                                  bottom: 0,
                                  child: GestureDetector(
                                    onTap: _showImageSourceDialog,
                                    child: Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: primaryColor,
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white,
                                          width: 2,
                                        ),
                                      ),
                                      child: const Icon(
                                        Icons.camera_alt,
                                        color: Colors.white,
                                        size: 20,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 40),
      
                          // Educational Goal Section
                          Text(
                            "Educational Goal",
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 16),
      
                          // Title Field
                          MyTextfield(
                            hintText: 'Title (e.g., JEE Mains, NEET)',
                            obsText: false,
                            prefixIcon: Icons.title,
                            accentColor: primaryColor,
                            controller: _titleController,
                            keyboardType: TextInputType.text,
                            isRequired: true,
                          ),
      
                          const SizedBox(height: 20),
      
                          // Target Field
                          MyTextfield(
                            hintText: 'Target (e.g., Under 3 digits rank)',
                            obsText: false,
                            prefixIcon: Icons.track_changes,
                            accentColor: primaryColor,
                            controller: _targetController,
                            keyboardType: TextInputType.text,
                            isRequired: true,
                          ),
      
                          const SizedBox(height: 20),
      
                          // Year Field
                          MyTextfield(
                            hintText: 'Year (e.g., 2025)',
                            obsText: false,
                            prefixIcon: Icons.calendar_today,
                            accentColor: primaryColor,
                            controller: _yearController,
                            keyboardType: TextInputType.number,
                            isRequired: true,
                          ),
      
                          const SizedBox(height: 20),
      
                          // Level Dropdown
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 5),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: DropdownButtonFormField<String>(
                              value: _selectedLevel,
                              decoration: InputDecoration(
                                labelText: 'Level',
                                labelStyle: GoogleFonts.poppins(color: Colors.grey.shade600),
                                prefixIcon: Icon(Icons.trending_up, color: primaryColor),
                                border: InputBorder.none,
                              ),
                              items: _levels.map((level) {
                                return DropdownMenuItem(
                                  value: level,
                                  child: Text(
                                    level,
                                    style: GoogleFonts.poppins(),
                                  ),
                                );
                              }).toList(),
                              onChanged: (value) {
                                setState(() {
                                  _selectedLevel = value;
                                });
                              },
                              validator: (value) {
                                if (value == null || value.isEmpty) {
                                  return 'Please select your level';
                                }
                                return null;
                              },
                              icon: Icon(Icons.arrow_drop_down, color: primaryColor),
                              dropdownColor: Colors.white,
                              style: GoogleFonts.poppins(color: Colors.black87),
                            ),
                          ),
      
                          const SizedBox(height: 32),
      
                          // Interests Section
                          Text(
                            "Interests",
                            style: GoogleFonts.poppins(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 16),
      
                          // Interest Tags Container
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.grey.shade300),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // Selected Tags
                                if (_selectedInterests.isNotEmpty)
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 8,
                                    children: _selectedInterests.map((interest) {
                                      return Chip(
                                        label: Text(
                                          interest,
                                          style: GoogleFonts.poppins(
                                            fontSize: 14,
                                            color: primaryColor,
                                          ),
                                        ),
                                        backgroundColor: primaryColor.withOpacity(0.1),
                                        deleteIconColor: primaryColor,
                                        onDeleted: () => _removeInterest(interest),
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(20),
                                          side: BorderSide(color: primaryColor.withOpacity(0.3)),
                                        ),
                                      );
                                    }).toList(),
                                  ),
      
                                if (_selectedInterests.isNotEmpty)
                                  const SizedBox(height: 10),
      
                                // Input field
                                Row(
                                  children: [
                                    Expanded(
                                      child: TextField(
                                        controller: _interestController,
                                        focusNode: _interestFocusNode,
                                        decoration: InputDecoration(
                                          hintText: 'Add interests (e.g., Physics, Chemistry)',
                                          hintStyle: GoogleFonts.poppins(
                                            color: Colors.grey.shade500,
                                            fontSize: 14,
                                          ),
                                          prefixIcon: Icon(Icons.interests, color: primaryColor),
                                          border: InputBorder.none,
                                          isDense: true,
                                          contentPadding: const EdgeInsets.symmetric(vertical: 10),
                                        ),
                                        style: GoogleFonts.poppins(
                                          fontSize: 15,
                                          color: Colors.black87,
                                        ),
                                        onSubmitted: (value) {
                                          if (value.trim().isNotEmpty) {
                                            _addInterest(value.trim());
                                            _interestFocusNode.requestFocus();
                                          }
                                        },
                                      ),
                                    ),
                                    IconButton(
                                      icon: Icon(Icons.add_circle, color: primaryColor),
                                      onPressed: () {
                                        if (_interestController.text.trim().isNotEmpty) {
                                          _addInterest(_interestController.text.trim());
                                          _interestFocusNode.requestFocus();
                                        }
                                      },
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
      
                          // Suggestions
                          const SizedBox(height: 12),
                          Text(
                            "Suggestions:",
                            style: GoogleFonts.poppins(
                              fontSize: 14,
                              color: Colors.black54,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _availableInterests
                                .where((interest) => !_selectedInterests.contains(interest))
                                .map((interest) {
                              return InkWell(
                                onTap: () => _addInterest(interest),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.grey.shade100,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(color: Colors.grey.shade300),
                                  ),
                                  child: Text(
                                    interest,
                                    style: GoogleFonts.poppins(
                                      fontSize: 13,
                                      color: Colors.black87,
                                    ),
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
      
                          const SizedBox(height: 40),
      
                          // Submit button
                          MyButton(
                            text: "Complete Setup",
                            onTap: _saveProfile,
                            accentColor: primaryColor,
                            isLoading: _isSaving,
                            icon: Icons.check,
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
      ),
    );
  }
}