import 'package:flutter/material.dart';

class MinimalistButton extends StatefulWidget {
  final VoidCallback onPressed;
  final bool isLoading;
  final bool isActive;
  final String defaultText;
  final String activeText;
  final IconData defaultIcon;
  final IconData activeIcon;
  final Color primaryColor;
  final Color secondaryColor;
  final double fontSize;
  final FontWeight fontWeight;
  final bool hideIconWhenActive;

  const MinimalistButton({
    Key? key,
    required this.onPressed,
    this.isLoading = false,
    this.isActive = false,
    required this.defaultText,
    required this.activeText,
    this.defaultIcon = Icons.add,
    this.activeIcon = Icons.check,
    this.primaryColor = Colors.blue,
    this.secondaryColor = Colors.black87,
    this.fontSize = 14,
    this.fontWeight = FontWeight.w500,
    this.hideIconWhenActive = false,
  }) : super(key: key);

  @override
  State<MinimalistButton> createState() => _MinimalistButtonState();
}

class _MinimalistButtonState extends State<MinimalistButton> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 350),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeInOut,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeInOut,
      ),
    );

    if (widget.isActive) {
      _animationController.value = 1.0;
    }
  }

  @override
  void didUpdateWidget(MinimalistButton oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isActive != oldWidget.isActive) {
      if (widget.isActive) {
        _animationController.forward();
      } else {
        _animationController.reverse();
      }
    }
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final bool isDarkMode = Theme.of(context).brightness == Brightness.dark;
    final Color textColor = isDarkMode ? Colors.white : Colors.black87;

    return AnimatedBuilder(
      animation: _animationController,
      builder: (context, child) {
        return GestureDetector(
          onTap: widget.isLoading ? null : widget.onPressed,
          child: Transform.scale(
            scale: _scaleAnimation.value,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeInOut,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.transparent,
                border: Border.all(
                  color: widget.isActive
                      ? widget.secondaryColor.withOpacity(0.6)
                      : widget.primaryColor,
                  width: 1.5,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              constraints: const BoxConstraints(minWidth: 110),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (widget.isLoading)
                    SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        valueColor: AlwaysStoppedAnimation<Color>(
                          widget.primaryColor,
                        ),
                      ),
                    )
                  else if (!(widget.isActive && widget.hideIconWhenActive))
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        Opacity(
                          opacity: 1 - _fadeAnimation.value,
                          child: Icon(
                            widget.defaultIcon,
                            size: 18,
                            color: widget.isActive
                                ? widget.secondaryColor.withOpacity(0.8)
                                : widget.primaryColor,
                          ),
                        ),
                        Opacity(
                          opacity: _fadeAnimation.value,
                          child: Icon(
                            widget.activeIcon,
                            size: 18,
                            color: widget.secondaryColor.withOpacity(0.8),
                          ),
                        ),
                      ],
                    ),
                  if (!widget.isLoading && (!(widget.isActive && widget.hideIconWhenActive)))
                    const SizedBox(width: 8),
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Opacity(
                        opacity: 1 - _fadeAnimation.value,
                        child: Text(
                          widget.defaultText,
                          style: TextStyle(
                            fontSize: widget.fontSize,
                            fontWeight: widget.fontWeight,
                            color: widget.isActive
                                ? widget.secondaryColor.withOpacity(0.8)
                                : widget.primaryColor,
                          ),
                        ),
                      ),
                      Opacity(
                        opacity: _fadeAnimation.value,
                        child: Text(
                          widget.activeText,
                          style: TextStyle(
                            fontSize: widget.fontSize,
                            fontWeight: widget.fontWeight,
                            color: widget.secondaryColor.withOpacity(0.8),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}

// Example usage with various text options
class ExampleScreen extends StatefulWidget {
  const ExampleScreen({Key? key}) : super(key: key);

  @override
  State<ExampleScreen> createState() => _ExampleScreenState();
}

class _ExampleScreenState extends State<ExampleScreen> {
  bool _isLoadingFriend = false;
  bool _isAddedFriend = false;
  bool _isLoadingFollow = false;
  bool _isFollowing = false;
  bool _isLoadingBookmark = false;
  bool _isBookmarked = false;
  bool _isLoadingSubscribe = false;
  bool _isSubscribed = false;

  Future<void> _toggleFriend() async {
    setState(() {
      _isLoadingFriend = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isLoadingFriend = false;
      _isAddedFriend = !_isAddedFriend;
    });
  }

  Future<void> _toggleFollow() async {
    setState(() {
      _isLoadingFollow = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isLoadingFollow = false;
      _isFollowing = !_isFollowing;
    });
  }

  Future<void> _toggleBookmark() async {
    setState(() {
      _isLoadingBookmark = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isLoadingBookmark = false;
      _isBookmarked = !_isBookmarked;
    });
  }

  Future<void> _toggleSubscribe() async {
    setState(() {
      _isLoadingSubscribe = true;
    });

    await Future.delayed(const Duration(seconds: 1));

    setState(() {
      _isLoadingSubscribe = false;
      _isSubscribed = !_isSubscribed;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reusable Buttons'),
        elevation: 0,
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Friend button
            MinimalistButton(
              onPressed: _toggleFriend,
              isLoading: _isLoadingFriend,
              isActive: _isAddedFriend,
              defaultText: 'Add Friend',
              activeText: 'Added',
              defaultIcon: Icons.person_add_alt,
              activeIcon: Icons.check,
              primaryColor: Colors.indigo,
            ),
            const SizedBox(height: 24),

            // Follow button
            MinimalistButton(
              onPressed: _toggleFollow,
              isLoading: _isLoadingFollow,
              isActive: _isFollowing,
              defaultText: 'Follow',
              activeText: 'Following',
              defaultIcon: Icons.add,
              activeIcon: Icons.check,
              primaryColor: Colors.teal,
              fontSize: 13,
            ),
            const SizedBox(height: 24),

            // Bookmark button (no icon when active)
            MinimalistButton(
              onPressed: _toggleBookmark,
              isLoading: _isLoadingBookmark,
              isActive: _isBookmarked,
              defaultText: 'Save Article',
              activeText: 'Saved',
              defaultIcon: Icons.bookmark_border,
              activeIcon: Icons.bookmark,
              hideIconWhenActive: true,
              primaryColor: Colors.amber[800]!,
              fontWeight: FontWeight.w600,
            ),
            const SizedBox(height: 24),

            // Subscribe button
            MinimalistButton(
              onPressed: _toggleSubscribe,
              isLoading: _isLoadingSubscribe,
              isActive: _isSubscribed,
              defaultText: 'Subscribe',
              activeText: 'Subscribed',
              defaultIcon: Icons.notifications_none,
              activeIcon: Icons.notifications,
              primaryColor: Colors.red,
              fontSize: 15,
            ),
          ],
        ),
      ),
    );
  }
}