import { View, Text, TouchableOpacity } from 'react-native';
import { ITask } from '../types/task';
import { useDispatch } from 'react-redux';
import { toggleTaskCompletionThunk } from '@/redux/thunks/taskThunks';
import {ThunkDispatch} from "redux-thunk";


interface TaskItemProps {
  task: ITask;
}

export default function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const handleToggle = () => {
    dispatch(toggleTaskCompletionThunk(task._id));
  };

  return (
    <View className="flex-row justify-between items-center p-2 border-b border-gray-200">
      <Text className="flex-1">{task.content}</Text>
      <TouchableOpacity onPress={handleToggle}>
        <Text className={task.isDoneByMe ? 'text-gray-400' : 'text-green-500'}>
          {task.isDoneByMe ? 'Done' : 'Mark Done'}
        </Text>
      </TouchableOpacity>
      <Text className={task.isDoneByBuddy ? 'text-gray-400' : 'text-red-500'}>
        Buddy: {task.isDoneByBuddy ? 'Done' : 'Pending'}
      </Text>
    </View>
  );
}