import 'package:flutter/material.dart';

class MyButton extends StatefulWidget {
  final String text;
  final Function()? onTap;
  final Color? accentColor;
  final IconData? icon;
  final bool isLoading;

  const MyButton({
    super.key,
    required this.text,
    required this.onTap,
    this.accentColor,
    this.icon,
    this.isLoading = false,
  });

  @override
  State<MyButton> createState() => _MyButtonState();
}

class _MyButtonState extends State<MyButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  bool _isPressed = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  void _handleTapDown(TapDownDetails details) {
    if (!widget.isLoading && widget.onTap != null) {
      setState(() {
        _isPressed = true;
      });
      _animationController.forward();
    }
  }

  void _handleTapUp(TapUpDetails details) {
    if (!widget.isLoading) {
      setState(() {
        _isPressed = false;
      });
      _animationController.reverse();
    }
  }

  void _handleTapCancel() {
    if (!widget.isLoading) {
      setState(() {
        _isPressed = false;
      });
      _animationController.reverse();
    }
  }

  @override
  Widget build(BuildContext context) {
    final Color buttonColor =
        widget.accentColor ?? Theme.of(context).primaryColor;
    final Color textColor =
        _getLuminance(buttonColor) > 0.5 ? Colors.black : Colors.white;

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: GestureDetector(
            onTap: widget.isLoading ? null : widget.onTap,
            onTapDown: _handleTapDown,
            onTapUp: _handleTapUp,
            onTapCancel: _handleTapCancel,
            child: Container(
              width: double.infinity,
              height: 60,
              decoration: BoxDecoration(
                color:
                    widget.isLoading
                        ? buttonColor.withOpacity(0.7)
                        : buttonColor,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: buttonColor.withOpacity(_isPressed ? 0.2 : 0.4),
                    spreadRadius: 1,
                    blurRadius: _isPressed ? 5 : 10,
                    offset: Offset(0, _isPressed ? 2 : 4),
                  ),
                ],
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    buttonColor.withOpacity(1),
                    HSLColor.fromColor(buttonColor)
                        .withLightness(
                          (HSLColor.fromColor(buttonColor).lightness - 0.1)
                              .clamp(0.0, 1.0),
                        )
                        .toColor(),
                  ],
                ),
              ),
              child: Center(
                child:
                    widget.isLoading
                        ? SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.5,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              textColor,
                            ),
                          ),
                        )
                        : Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            if (widget.icon != null) ...[
                              Icon(widget.icon, color: textColor, size: 20),
                              const SizedBox(width: 10),
                            ],
                            Text(
                              widget.text,
                              style: TextStyle(
                                color: textColor,
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
              ),
            ),
          ),
        );
      },
    );
  }

  double _getLuminance(Color color) {
    return (0.299 * color.red + 0.587 * color.green + 0.114 * color.blue) / 255;
  }
}
