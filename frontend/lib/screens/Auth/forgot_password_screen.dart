import 'package:flutter/material.dart';
import 'package:frontend/components/my_button.dart';
import 'package:frontend/components/my_textfield.dart';
import 'package:frontend/screens/Auth/mobile_verify.dart' show OtpVerificationScreen, OtpVerificationType;
import 'package:google_fonts/google_fonts.dart';

class ForgotPasswordScreen extends StatelessWidget {
  const ForgotPasswordScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 25),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Row(
                children: [
                  IconButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    icon: Icon(Icons.arrow_back, size: 30),
                  ),
                  SizedBox(width: 5),
                  Text(
                    'Enter Mobile Number',
                    style: GoogleFonts.poppins(fontSize: 28),
                  ),
                ],
              ),
              SizedBox(height: 50),
              MyTextfield(hintText: 'Mobile Number', obsText: false, isRequired: true,),
              SizedBox(height: 25),
              MyButton(
                text: "Send OTP",
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder:
                          (context) =>
                              OtpVerificationScreen(mobileNumber: '9313343975', verificationType: OtpVerificationType.passwordReset,),
                    ),
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
