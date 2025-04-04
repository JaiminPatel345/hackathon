import {View, Text, Image, ScrollView} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '@/redux/store';
import {logout} from '@/redux/slices/authSlice';
import Button from '@/components/Button';

export default function Profile() {
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <ScrollView className="flex-1 p-4">
            <Text className="text-2xl mb-4">Profile</Text>
            {user && (
                <>
                    <Image source={{uri: user?.avatar}} className="w-24 h-24 rounded-full mb-4"/>
                    <Text className="text-lg">Name: {user.name}</Text>
                    <Text>Username: {user.username}</Text>
                    <Text>Mobile: {user.mobile}</Text>
                    <Text className="mt-2">Goal: {user?.goal?.title}</Text>
                    <Text>Target: {user.goal?.target}</Text>
                    <Text>Year: {user.goal?.year}</Text>
                    <Text>Level: {user.goal?.level}</Text>
                    <Text className="mt-2">Interests: {user?.interests.join(', ')}</Text>
                    <Button title="Logout" onPress={handleLogout} className="mt-4"/>
                </>
            )}
        </ScrollView>
    );
}