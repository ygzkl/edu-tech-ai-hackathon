import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import CourseScreen from './screens/CourseScreen';
import FlashcardScreen from './screens/FlashcardScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ders Seçimi' }} />
        <Stack.Screen name="Course" component={CourseScreen} options={{ title: 'Ders Detayı' }} />
        <Stack.Screen name="Flashcards" component={FlashcardScreen} options={{ title: 'Flashcards' }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}
