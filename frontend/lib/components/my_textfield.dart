import 'package:flutter/material.dart';

class MyTextfield extends StatefulWidget {
  final String hintText;
  final bool obsText;
  final IconData? prefixIcon;
  final Color? accentColor;
  final TextEditingController? controller;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;
  final bool isRequired;

  const MyTextfield({
    super.key,
    required this.hintText,
    required this.obsText,
    this.prefixIcon,
    this.accentColor,
    this.controller,
    this.keyboardType,
    this.validator,
    required this.isRequired,
  });

  @override
  State<MyTextfield> createState() => _MyTextfieldState();
}

class _MyTextfieldState extends State<MyTextfield>
    with SingleTickerProviderStateMixin {
  late AnimationController _focusAnimationController;
  late Animation<double> _borderAnimation;
  final FocusNode _focusNode = FocusNode();
  bool _isFocused = false;
  bool _obscureText = true;

  @override
  void initState() {
    super.initState();
    _focusAnimationController = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _borderAnimation = Tween<double>(begin: 0, end: 6).animate(
      CurvedAnimation(
        parent: _focusAnimationController,
        curve: Curves.easeInOut,
      ),
    );
    _focusNode.addListener(_onFocusChange);

    // Initialize the obscure text state from the widget's obsText property
    _obscureText = widget.obsText;
  }

  void _onFocusChange() {
    setState(() {
      _isFocused = _focusNode.hasFocus;
    });
    if (_focusNode.hasFocus) {
      _focusAnimationController.forward();
    } else {
      _focusAnimationController.reverse();
    }
  }

  @override
  void dispose() {
    _focusAnimationController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final Color activeColor =
        widget.accentColor ?? Theme.of(context).primaryColor;

    return AnimatedBuilder(
      animation: _borderAnimation,
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            boxShadow:
                _isFocused
                    ? [
                      BoxShadow(
                        color: activeColor.withOpacity(0.3),
                        blurRadius: _borderAnimation.value * 3,
                        spreadRadius: _borderAnimation.value / 2,
                      ),
                    ]
                    : null,
          ),
          child: TextField(
            controller: widget.controller,
            keyboardType: widget.keyboardType,
            focusNode: _focusNode,
            obscureText: widget.obsText ? _obscureText : false,
            decoration: InputDecoration(
              hintText: widget.hintText + (widget.isRequired ? '*' : ''),
              prefixIcon:
                  widget.prefixIcon != null
                      ? Icon(
                        widget.prefixIcon,
                        color: _isFocused ? activeColor : Colors.grey,
                      )
                      : null,
              // Add suffix icon (eye button) only for password fields
              suffixIcon:
                  widget.obsText
                      ? IconButton(
                        icon: Icon(
                          _obscureText
                              ? Icons.visibility_off
                              : Icons.visibility,
                          color: _isFocused ? activeColor : Colors.grey,
                          size: 22,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscureText = !_obscureText;
                          });
                        },
                        splashRadius: 20,
                        tooltip:
                            _obscureText ? 'Show password' : 'Hide password',
                      )
                      : null,
              filled: true,
              fillColor: _isFocused ? Colors.white : Colors.grey.shade50,
              hintStyle: TextStyle(
                color: Colors.grey.shade400,
                fontWeight: FontWeight.w400,
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(color: Colors.grey.shade300, width: 1.5),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide(
                  color: activeColor,
                  width: 2.0 + _borderAnimation.value / 2,
                ),
              ),
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 20,
                vertical: 16,
              ),
            ),
          ),
        );
      },
    );
  }
}
