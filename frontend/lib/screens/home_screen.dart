import 'package:flutter/material.dart';
import 'dart:math' as math;


class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> with TickerProviderStateMixin {
  int _currentIndex = 0;
  final List<Task> _tasks = [];
  late AnimationController _fabAnimationController;
  late Animation<double> _fabRotationAnimation;
  late AnimationController _taskListAnimationController;
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();

    // Sample data
    _tasks.addAll([
      Task("Complete project proposal", DateTime.now().add(const Duration(days: 2)), 'Work', Colors.blue),
      Task("Buy groceries", DateTime.now().add(const Duration(days: 1)), 'Personal', Colors.green),
      Task("Call mom", DateTime.now(), 'Family', Colors.orange),
    ]);

    // Initialize animation controllers
    _fabAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );

    _fabRotationAnimation = Tween<double>(
      begin: 0,
      end: math.pi / 4,
    ).animate(CurvedAnimation(
      parent: _fabAnimationController,
      curve: Curves.easeInOut,
    ));

    _taskListAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );

    // Simulate loading delay
    Future.delayed(const Duration(milliseconds: 600), () {
      setState(() {
        _isLoaded = true;
      });
      _taskListAnimationController.forward();
    });
  }

  @override
  void dispose() {
    _fabAnimationController.dispose();
    _taskListAnimationController.dispose();
    super.dispose();
  }

  void _onNavItemTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  void _showAddTaskDialog() {
    String title = '';
    String category = 'Personal';
    DateTime dueDate = DateTime.now().add(const Duration(days: 1));

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Create New Task'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  autofocus: true,
                  decoration: const InputDecoration(
                    labelText: 'Task Title',
                    border: OutlineInputBorder(),
                  ),
                  onChanged: (value) {
                    title = value;
                  },
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  decoration: const InputDecoration(
                    labelText: 'Category',
                    border: OutlineInputBorder(),
                  ),
                  value: category,
                  items: const [
                    DropdownMenuItem(value: 'Personal', child: Text('Personal')),
                    DropdownMenuItem(value: 'Work', child: Text('Work')),
                    DropdownMenuItem(value: 'Family', child: Text('Family')),
                    DropdownMenuItem(value: 'Health', child: Text('Health')),
                  ],
                  onChanged: (value) {
                    category = value!;
                  },
                ),
                const SizedBox(height: 16),
                ListTile(
                  title: Text('Due Date: ${dueDate.toString().substring(0, 10)}'),
                  trailing: const Icon(Icons.calendar_today),
                  onTap: () async {
                    final selectedDate = await showDatePicker(
                      context: context,
                      initialDate: dueDate,
                      firstDate: DateTime.now(),
                      lastDate: DateTime.now().add(const Duration(days: 365)),
                    );
                    if (selectedDate != null) {
                      dueDate = selectedDate;
                    }
                  },
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              child: const Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            ElevatedButton(
              child: const Text('Create'),
              onPressed: () {
                if (title.isNotEmpty) {
                  setState(() {
                    _tasks.add(Task(
                        title,
                        dueDate,
                        category,
                        category == 'Work' ? Colors.blue :
                        category == 'Personal' ? Colors.green :
                        category == 'Family' ? Colors.orange :
                        Colors.purple
                    ));
                  });
                  Navigator.of(context).pop();
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Task Buddy'),
            Text(
              'Welcome back, Alex',
              style: TextStyle(
                fontSize: 14,
                color: Theme.of(context).brightness == Brightness.light
                    ? Colors.white70
                    : Colors.grey[300],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            tooltip: 'Search for buddies',
            onPressed: () {
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => Scaffold(
                        appBar: AppBar(title: const Text('Find Buddies')),
                        body: const Center(child: Text('Buddy search page')),
                      )
                  )
              );
            },
          ),
          const CircleAvatar(
            radius: 16,
            backgroundImage: NetworkImage('https://via.placeholder.com/150'),
          ),
          const SizedBox(width: 16),
        ],
        elevation: 0,
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          // Home/Tasks screen
          _isLoaded ? AnimatedTaskList(
            tasks: _tasks,
            animationController: _taskListAnimationController,
          ) : const Center(child: CircularProgressIndicator()),

          // Calendar screen
          const Center(child: Text('Calendar View')),

          // Stats screen
          const Center(child: Text('Stats View')),

          // Profile screen
          const Center(child: Text('Profile View')),
        ],
      ),
      floatingActionButton: RotationTransition(
        turns: _fabRotationAnimation,
        child: FloatingActionButton(
          onPressed: () {
            _fabAnimationController.forward(from: 0);
            _showAddTaskDialog();
          },
          child: const Icon(Icons.add),
          elevation: 4,
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onNavItemTapped,
        type: BottomNavigationBarType.fixed,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today),
            label: 'Calendar',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.bar_chart),
            label: 'Stats',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class AnimatedTaskList extends StatelessWidget {
  final List<Task> tasks;
  final AnimationController animationController;

  const AnimatedTaskList({
    Key? key,
    required this.tasks,
    required this.animationController,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: _buildHeaderSection(),
          ),
        ),
        SliverList(
          delegate: SliverChildBuilderDelegate(
                (context, index) {
              final task = tasks[index];

              // Staggered animation for tasks
              final itemAnimation = Tween<Offset>(
                begin: const Offset(1, 0),
                end: Offset.zero,
              ).animate(CurvedAnimation(
                parent: animationController,
                curve: Interval(
                  index * 0.1,
                  0.6 + index * 0.1,
                  curve: Curves.easeOutQuart,
                ),
              ));

              return SlideTransition(
                position: itemAnimation,
                child: FadeTransition(
                  opacity: animationController,
                  child: TaskTile(task: task),
                ),
              );
            },
            childCount: tasks.length,
          ),
        ),
      ],
    );
  }

  Widget _buildHeaderSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'My Tasks',
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          'You have ${tasks.length} tasks to complete',
          style: const TextStyle(
            fontSize: 16,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 16),
        FadeTransition(
          opacity: animationController,
          child: Container(
            height: 100,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.purpleAccent.shade100, Colors.blueAccent.shade100],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Center(
              child: ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Colors.white,
                  child: Icon(Icons.trending_up, color: Colors.blue),
                ),
                title: const Text(
                  'Weekly Progress',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                subtitle: const Text(
                  '68% of tasks completed',
                  style: TextStyle(color: Colors.white70),
                ),
                trailing: const Icon(Icons.arrow_forward, color: Colors.white),
              ),
            ),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }
}

class TaskTile extends StatefulWidget {
  final Task task;

  const TaskTile({Key? key, required this.task}) : super(key: key);

  @override
  State<TaskTile> createState() => _TaskTileState();
}

class _TaskTileState extends State<TaskTile> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _isCompleted = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 300),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final daysRemaining = widget.task.dueDate.difference(DateTime.now()).inDays;
    final isOverdue = daysRemaining < 0;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 8,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return ListTile(
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              leading: InkWell(
                onTap: () {
                  if (_isCompleted) {
                    _controller.reverse();
                  } else {
                    _controller.forward();
                  }
                  setState(() {
                    _isCompleted = !_isCompleted;
                  });
                },
                child: Container(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: widget.task.color,
                      width: 2,
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(2.0),
                    child: _isCompleted
                        ? Icon(
                      Icons.check,
                      color: widget.task.color,
                      size: 20,
                    )
                        : Icon(
                      Icons.circle,
                      color: Colors.transparent,
                      size: 20,
                    ),
                  ),
                ),
              ),
              title: Text(
                widget.task.title,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  decoration: _isCompleted ? TextDecoration.lineThrough : null,
                  color: _isCompleted ? Colors.grey : null,
                ),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 4),
                  Text(
                    widget.task.category,
                    style: TextStyle(
                      color: widget.task.color,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    isOverdue
                        ? 'Overdue by ${-daysRemaining} days'
                        : daysRemaining == 0
                        ? 'Due today'
                        : 'Due in $daysRemaining days',
                    style: TextStyle(
                      color: isOverdue ? Colors.red : Colors.grey,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              trailing: const Icon(Icons.more_vert),
            );
          },
        ),
      ),
    );
  }
}

class Task {
  final String title;
  final DateTime dueDate;
  final String category;
  final Color color;

  Task(this.title, this.dueDate, this.category, this.color);
}