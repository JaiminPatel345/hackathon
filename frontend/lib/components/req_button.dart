import 'package:flutter/material.dart';

class ReqButton extends StatelessWidget {
  final Function onTap;

  const ReqButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => onTap,
      child: Container(
        height: 50,
        width: 50,
        child: Icon(Icons.add),
      ),
    );
  }
}
