import 'package:flutter/material.dart';
import 'package:percent_indicator/percent_indicator.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  // Create state variables for user's checklist items only
  List<bool> myChecklistStatus = [false, true, false, false];
  // Buddy's checklist is fixed and read-only
  final List<bool> buddyChecklistStatus = [true, false, false, true];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 16),
                _buildAppBar(),
                const SizedBox(height: 16),
                _buildWelcomeText(),
                const SizedBox(height: 24),
                _buildCreateGoalButton(),
                const SizedBox(height: 24),
                _buildExamCountdown(),
                const SizedBox(height: 24),
                _buildStudySprintCard(),
                const SizedBox(height: 24),
                _buildCreateButton(),
                const SizedBox(height: 24),
                _buildDailyChecklist(),
                const SizedBox(height: 80),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(),
    );
  }

  Widget _buildAppBar() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFF4A2D82),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Row(
            children: [Icon(Icons.grid_view, color: Colors.white, size: 22)],
          ),
        ),
        Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: const Color(0xFF6B46C1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: const Icon(Icons.chat_bubble, color: Colors.white, size: 24),
        ),
      ],
    );
  }

  Widget _buildWelcomeText() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Hello, Jaiminbhai',
          style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          'Let\'s find your buddy!',
          style: TextStyle(fontSize: 16, color: Colors.grey[600]),
        ),
      ],
    );
  }

  Widget _buildCreateGoalButton() {
    return Container(
      width: double.infinity,
      height: 60,
      decoration: BoxDecoration(
        color: const Color(0xFF4A2D82),
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.purple.withOpacity(0.3),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.edit_note, color: Colors.white),
          ),
          const SizedBox(width: 12),
          const Text(
            'Create Goal',
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExamCountdown() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
      decoration: BoxDecoration(
        color: const Color(0xFFf7f5ff),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            '40 Days Left',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
            decoration: BoxDecoration(
              color: const Color(0xFFEAE4FF),
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Text(
              'JEE EXAM',
              style: TextStyle(
                color: Color(0xFF4A2D82),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudySprintCard() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Study Sprint: Who\'s Winning?',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 4),
        Text(
          'You\'re catching up!',
          style: TextStyle(color: Colors.grey[600], fontSize: 16),
        ),
        const SizedBox(height: 16),
        _buildComparisonCard('Total Study Hours Logged', '4 hrs', '5 hrs'),
        const SizedBox(height: 12),
        _buildComparisonCard('Chapters Completed', '10', '8'),
        const SizedBox(height: 12),
        _buildComparisonCard(
          'Average Mock Test',
          '75%',
          '80%',
          showProgress: true,
        ),
        const SizedBox(height: 12),
        _buildComparisonCard('Revision Done', '2', '3'),
      ],
    );
  }

  Widget _buildComparisonCard(
    String title,
    String myValue,
    String buddyValue, {
    bool showProgress = false,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF6F5FA),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontWeight: FontWeight.w500,
              color: Colors.grey[700],
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Me: $myValue',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: Color(0xFF4A2D82),
                      ),
                    ),
                    if (showProgress)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: LinearProgressIndicator(
                          value: 0.75,
                          backgroundColor: Colors.grey[300],
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF4A2D82),
                          ),
                          minHeight: 6,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Buddy: $buddyValue',
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                        color: Color(0xFF34C759),
                      ),
                    ),
                    if (showProgress)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: LinearProgressIndicator(
                          value: 0.8,
                          backgroundColor: Colors.grey[300],
                          valueColor: const AlwaysStoppedAnimation<Color>(
                            Color(0xFF34C759),
                          ),
                          minHeight: 6,
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCreateButton() {
    return Container(
      width: double.infinity,
      height: 54,
      decoration: BoxDecoration(
        color: const Color(0xFFF6F5FA),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(2),
            decoration: BoxDecoration(
              color: Colors.black,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.add, color: Colors.white, size: 18),
          ),
          const SizedBox(width: 10),
          const Text(
            'Create',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildDailyChecklist() {
    final List<String> tasks = [
      'Study for at least 3 hours',
      'Solve previous year\'s questions',
      'Complete 20+ MCQs',
      'Discuss doubts with a friend',
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Daily Checklist',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        for (int i = 0; i < tasks.length; i++) ...[
          _buildChecklistItem(tasks[i], i),
          const SizedBox(height: 12),
        ],
      ],
    );
  }

  Widget _buildChecklistItem(String task, int index) {
    return Row(
      children: [
        Expanded(
          flex: 7,
          child: Row(
            children: [
              GestureDetector(
                onTap: () {
                  setState(() {
                    // Only the user's checklist items can be toggled
                    myChecklistStatus[index] = !myChecklistStatus[index];
                  });
                },
                child: Container(
                  height: 24,
                  width: 24,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color:
                          myChecklistStatus[index]
                              ? const Color(0xFF34C759)
                              : Colors.grey.shade400,
                    ),
                    color:
                        myChecklistStatus[index]
                            ? const Color(0xFF34C759)
                            : Colors.transparent,
                  ),
                  child:
                      myChecklistStatus[index]
                          ? const Icon(
                            Icons.check,
                            size: 16,
                            color: Colors.white,
                          )
                          : null,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  task,
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                    color:
                        myChecklistStatus[index] ? Colors.grey : Colors.black87,
                    decoration:
                        myChecklistStatus[index]
                            ? TextDecoration.lineThrough
                            : null,
                  ),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          flex: 3,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              Text(
                'Buddy:',
                style: TextStyle(fontSize: 14, color: Colors.grey[600]),
              ),
              const SizedBox(width: 8),
              Container(
                height: 22,
                width: 22,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(6),
                  color:
                      buddyChecklistStatus[index]
                          ? const Color(0xFF34C759)
                          : Colors.transparent,
                  border: Border.all(
                    color:
                        buddyChecklistStatus[index]
                            ? const Color(0xFF34C759)
                            : Colors.grey.shade400,
                  ),
                ),
                child:
                    buddyChecklistStatus[index]
                        ? const Icon(Icons.check, size: 14, color: Colors.white)
                        : null
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 0,
            blurRadius: 10,
            offset: const Offset(0, -1),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(Icons.home, 'Home', isActive: true),
          _buildNavItem(Icons.play_circle_outline, 'My Goal'),
          _buildNavItem(Icons.bookmark_border, 'Resources'),
          _buildNavItem(Icons.person_outline, 'My Profile'),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, {bool isActive = false}) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          icon,
          color: isActive ? const Color(0xFF4A2D82) : Colors.grey,
          size: 26,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: isActive ? const Color(0xFF4A2D82) : Colors.grey,
            fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
          ),
        ),
      ],
    );
  }
}
