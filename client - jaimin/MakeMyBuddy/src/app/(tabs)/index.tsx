import { View, Text, ScrollView, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar } from 'react-native-calendars';
import {RootState} from "@/redux/store";
import {createTaskThunk, fetchTasksThunk} from "@/redux/thunks/taskThunks";
import TaskItem from "@/components/TaskItem";
import Button from "@/components/Button";
import Input from "@/components/Input";
import {ThunkDispatch} from "redux-thunk";


export default function Home() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const user = useSelector((state: RootState) => state.auth.user);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({ content: '', category: 'Daily', isPrivate: false });

  useEffect(() => {
    dispatch(fetchTasksThunk());
  }, [dispatch]);

  const handleCreateTask = async () => {
    await dispatch(createTaskThunk(newTask));
    setModalVisible(false);
    setNewTask({ content: '', category: 'Daily', isPrivate: false });
  };

  interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor: string;
  };
}

// Your reduce function
const markedDates = tasks.reduce<MarkedDates>((acc, task) => {
  const date = new Date(task.createdAt).toISOString().split('T')[0];
  acc[date] = { marked: true, dotColor: 'blue' };
  return acc;
}, {});

  return (
    <ScrollView className="flex-1 p-4">
      <Text className="text-2xl mb-4">Home</Text>
      {user?.goal && (
        <View className="mb-4">
          <Text className="text-lg">Goal: {user.goal.title}</Text>
          <Text>Target: {user.goal.target} by {user.goal.year}</Text>
          {!user.buddy && <Text className="text-red-500">Find a buddy to collaborate!</Text>}
        </View>
      )}
      <Calendar markedDates={markedDates} />
      <Text className="text-xl mt-4 mb-2">Daily Tasks</Text>
      {tasks
        .filter((task) => task.category === 'Daily')
        .map((task) => (
          <TaskItem key={task._id} task={task} />
        ))}
      <Button title="Create Task" onPress={() => setModalVisible(true)} className="mt-4" />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-gray-800 bg-opacity-50">
          <View className="bg-white p-4 rounded-lg w-3/4">
            <Text className="text-xl mb-2">New Task</Text>
            <Input
              placeholder="Task Content"
              value={newTask.content}
              onChangeText={(text) => setNewTask({ ...newTask, content: text })}
            />
            <Button title="Create" onPress={handleCreateTask} />
            <Button
              title="Cancel"
              onPress={() => setModalVisible(false)}
              className="bg-gray-500 mt-2"
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}