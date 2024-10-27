import React, { useEffect, useState } from "react";
import { View, Button, Text, StatusBar, StyleSheet } from "react-native";
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from "@react-native-voice/voice";

const App: React.FC = () => {
  const [started, setStarted] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    // Set up Voice event listeners
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    // Clean up listeners on unmount
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startSpeechToText = async () => {
    try {
      await Voice.start("en-NZ");
      setStarted(true);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
    }
  };

  const stopSpeechToText = async () => {
    try {
      await Voice.stop();
      setStarted(false);
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    setResults(event.value || []);
  };

  const onSpeechError = (event: SpeechErrorEvent) => {
    console.error("Speech recognition error:", event.error);
  };

  return (
    <View style={styles.container}>
      {!started && (
        <Button title="Start Speech to Text" onPress={startSpeechToText} />
      )}
      {started && (
        <Button title="Stop Speech to Text" onPress={stopSpeechToText} />
      )}
      {results.map((result, index) => (
        <Text key={index}>{result}</Text>
      ))}
      <StatusBar barStyle="default" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
