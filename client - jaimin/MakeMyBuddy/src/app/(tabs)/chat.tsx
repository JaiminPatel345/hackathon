import {ScrollView, Text} from 'react-native';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchConversationsThunk} from '@/redux/thunks/chatThunks';
import {RootState} from '@/redux/store';
import ConversationItem from '@/components/ConversationItem';
import {ThunkDispatch} from "redux-thunk";

export default function Chat() {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const conversations = useSelector((state: RootState) => state.chat.conversations);

  useEffect(() => {
    dispatch(fetchConversationsThunk());
  }, [dispatch]);

  return (
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl mb-4">Chat</Text>
        {conversations.map((conv) => (
            <ConversationItem key={conv._id} conversation={conv}/>
        ))}
      </ScrollView>
  );
}
