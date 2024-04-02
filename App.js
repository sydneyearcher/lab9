import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

const Stack = createNativeStackNavigator();

function RepititionExerciseScreen({ route, navigation }) {
  const { name, count } = route.params;

  const increaseCount = () => {
    navigation.setParams({ count: count + 1 });
  };

  const resetCount = () => {
    navigation.setParams({ count: 0 });
  };

  const gotoSuggestedExercise = () => {
    const exerciseList = [
      {
        name: "Push Ups",
        key: "1",
        suggested: "Running"
      },
      {
        name: "Running",
        key: "2",
        suggested: "Planks"
      },
      {
        name: "Planks",
        key: "3",
        suggested: "Swimming"
      },
      {
        name: "Swimming",
        key: "4",
        suggested: "Push Ups"
      },
    ];

    // Find the index of the current exercise
    const currentIndex = exerciseList.findIndex(exercise => exercise.name === name);

    // Find the index of the suggested exercise
    const suggestedIndex = (currentIndex + 1) % exerciseList.length;

    // Check if the suggested exercise is a duration exercise
    if (exerciseList[suggestedIndex].name === "Running" || exerciseList[suggestedIndex].name === "Swimming") {
      navigation.navigate("DurationExercise", { name: exerciseList[suggestedIndex].name });
    } else {
      // Navigate to the suggested repetition exercise
      navigation.push("RepititionExercise", { name: exerciseList[suggestedIndex].name, count: 0 });
    }
  };

  const gotoDurationExercise = () => {
    navigation.navigate("DurationExercise", { name });
  };

  return (
    <View style={styles.container}>
      <Text>{name} : {count}</Text>
      <Button onPress={increaseCount} title="Increase Count" />
      <Button onPress={resetCount} title="Reset Count" />
      <Button onPress={gotoSuggestedExercise} title="Suggested Exercise" />
      <Button onPress={gotoDurationExercise} title="Start Duration Exercise" />
      <StatusBar style="auto" />
    </View>
  );
}

function DurationExerciseScreen({ route, navigation }) {
  const { name } = route.params;
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(0);
    setIsRunning(false);
  };

  return (
    <View style={styles.container}>
      <Text>{name} : Timer</Text>
      <Text>{formatTime(timer)}</Text>
      {isRunning ? (
        <Button onPress={stopTimer} title="Stop Timer" />
      ) : (
        <Button onPress={startTimer} title="Start Timer" />
      )}
      <Button onPress={resetTimer} title="Reset Timer" />
      <StatusBar style="auto" />
    </View>
  );
}

function HomeScreen({ navigation }) {
  const exerciseList = [
    {
      name: "Push Ups",
      key: "1",
      suggested: "Running"
    },
    {
      name: "Running",
      key: "2",
      suggested: "Planks"
    },
    {
      name: "Planks",
      key: "3",
      suggested: "Swimming"
    },
    {
      name: "Swimming",
      key: "4",
      suggested: "Push Ups"
    },
  ];

  const gotoExercise = (name) => {
    navigation.navigate("RepititionExercise", { name: name, count: 0 });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={exerciseList}
        renderItem={({ item }) => (
          <View style={styles.buttonContainer}>
            <Button
              onPress={() => gotoExercise(item.name)}
              title={item.name}
            />
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RepititionExercise" component={RepititionExerciseScreen} />
        <Stack.Screen name="DurationExercise" component={DurationExerciseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  
    backgroundColor: 'light grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: 10, 
  },
});

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
