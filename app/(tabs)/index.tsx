import { useState } from 'react';
import { nanoid } from 'nanoid';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export type TaskType = {
  id: string;
  text: string;
  completed: boolean;
};

const FEEDBACK_DURATION_MS = 2000;

export default function HomeScreen() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [inputText, setInputText] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showFeedback = (message: string) => {
    setFeedbackMessage(message);
    setTimeout(() => setFeedbackMessage(null), FEEDBACK_DURATION_MS);
  };

  const handleAddTask = () => {
    if (!inputText.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: nanoid(), text: inputText.trim(), completed: false },
    ]);
    setInputText('');
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      const task = next.find((t) => t.id === id);
      if (task?.completed) showFeedback('Task completed');
      else showFeedback('Task uncompleted');
      return next;
    });
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showFeedback('Task deleted');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.screenContent}
      keyboardShouldPersistTaps="handled"
    >
      <ThemedText type="title" style={styles.screenTitle}>
        My Tasks
      </ThemedText>
      <ThemedView style={styles.addTaskContainer}>
        <TextInput
          style={styles.input}
          placeholder="New task..."
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <Pressable
          onPress={handleAddTask}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressedOpacity,
          ]}
        >
          <ThemedText type="defaultSemiBold" style={styles.addButtonText}>
            Add
          </ThemedText>
        </Pressable>
      </ThemedView>
      {feedbackMessage !== null && (
        <ThemedView style={styles.feedbackBanner}>
          <ThemedText style={styles.feedbackText}>{feedbackMessage}</ThemedText>
        </ThemedView>
      )}
      <ThemedView style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskRow}>
            <Pressable
              onPress={() => handleToggleComplete(task.id)}
              style={({ pressed }) => [
                styles.checkboxTouchTarget,
                pressed && styles.pressedOpacity,
              ]}
              hitSlop={12}
            >
              <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
                {task.completed && (
                  <ThemedText style={styles.checkboxCheck}>✓</ThemedText>
                )}
              </View>
            </Pressable>
            <ThemedText
              style={[styles.taskText, task.completed && styles.taskTextCompleted]}
              numberOfLines={2}
            >
              {task.text}
            </ThemedText>
            <View style={styles.taskControls}>
              <Pressable
                onPress={() => handleToggleComplete(task.id)}
                style={({ pressed }) => [
                  styles.taskControl,
                  pressed && styles.pressedOpacity,
                ]}
              >
                <ThemedText type="defaultSemiBold">
                  {task.completed ? 'Undo' : 'Complete'}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(task.id)}
                style={({ pressed }) => [
                  styles.taskControl,
                  styles.deleteControl,
                  pressed && styles.pressedOpacity,
                ]}
              >
                <ThemedText type="defaultSemiBold" style={styles.deleteText}>
                  Delete
                </ThemedText>
              </Pressable>
            </View>
          </View>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const MIN_TOUCH_TARGET = 44;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  screenTitle: {
    marginBottom: 24,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    minHeight: MIN_TOUCH_TARGET,
  },
  addButton: {
    backgroundColor: '#0a7',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
  },
  feedbackBanner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'rgba(0,120,200,0.15)',
    borderRadius: 10,
  },
  feedbackText: {
    fontSize: 14,
  },
  pressedOpacity: {
    opacity: 0.7,
  },
  taskList: {
    gap: 12,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    minHeight: MIN_TOUCH_TARGET + 16,
  },
  checkboxTouchTarget: {
    padding: 10,
    margin: -10,
    alignSelf: 'center',
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0a7',
    borderColor: '#0a7',
  },
  checkboxCheck: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    color: '#888',
  },
  taskControls: {
    flexDirection: 'row',
    gap: 8,
  },
  taskControl: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: MIN_TOUCH_TARGET,
    justifyContent: 'center',
    borderRadius: 8,
  },
  deleteControl: {},
  deleteText: {
    color: '#c00',
  },
});
