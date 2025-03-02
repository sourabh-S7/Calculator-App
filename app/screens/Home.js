import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Vibration,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Calculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState('');
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [animation] = useState(new Animated.Value(1));

  // Animation for button press
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(animation, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleNumberPress = (num) => {
    Vibration.vibrate(10); // Subtle haptic feedback
    animatePress();

    if (waitingForOperand) {
      setDisplayValue(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? String(num) : displayValue + num);
    }
  };

  const handleOperationPress = (op) => {
    Vibration.vibrate(15); // Slightly stronger haptic for operations
    animatePress();

    if (operation && !waitingForOperand) {
      calculateResult();
    } else {
      setPreviousValue(displayValue);
    }
    setOperation(op);
    setWaitingForOperand(true);
  };

  const calculateResult = () => {
    const current = parseFloat(displayValue);
    const previous = parseFloat(previousValue);
    let result;

    switch (operation) {
      case '+':
        result = previous + current;
        break;
      case '−':
        result = previous - current;
        break;
      case '×':
        result = previous * current;
        break;
      case '÷':
        result = previous / current;
        break;
      default:
        return;
    }

    setDisplayValue(String(result));
    setPreviousValue(String(result));
  };

  const handleEqual = () => {
    if (!operation) return;
    calculateResult();
    setOperation(null);
    setWaitingForOperand(true);
    Vibration.vibrate(20); // Strong haptic for equals
  };

  const clearDisplay = () => {
    setDisplayValue('0');
    setPreviousValue('');
    setOperation(null);
    setWaitingForOperand(false);
    Vibration.vibrate(10);
  };

  const handlePercent = () => {
    const current = parseFloat(displayValue);
    setDisplayValue(String(current / 100));
    Vibration.vibrate(10);
  };

  const toggleSign = () => {
    setDisplayValue(String(-1 * parseFloat(displayValue)));
    Vibration.vibrate(10);
  };

  const buttons = [
    [
      { label: 'C', type: 'function' },
      { label: '±', type: 'function' },
      { label: '%', type: 'function' },
      { label: '÷', type: 'operator' },
    ],
    [
      { label: '7', type: 'number' },
      { label: '8', type: 'number' },
      { label: '9', type: 'number' },
      { label: '×', type: 'operator' },
    ],
    [
      { label: '4', type: 'number' },
      { label: '5', type: 'number' },
      { label: '6', type: 'number' },
      { label: '−', type: 'operator' },
    ],
    [
      { label: '1', type: 'number' },
      { label: '2', type: 'number' },
      { label: '3', type: 'number' },
      { label: '+', type: 'operator' },
    ],
    [
      { label: '0', type: 'number', width: 2 },
      { label: '.', type: 'number' },
      { label: '=', type: 'operator' },
    ],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#1F1F1F', '#121212']}
        style={styles.gradient}
      >
        <View style={styles.displayContainer}>
          {previousValue !== '' && (
            <Text style={styles.previousValue}>
              {previousValue} {operation}
            </Text>
          )}
          <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
            {displayValue}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((button) => (
                <TouchableOpacity
                  key={button.label}
                  style={[
                    styles.button,
                    button.width === 2 && styles.doubleButton,
                    button.type === 'operator' && styles.operatorButton,
                    button.type === 'function' && styles.functionButton,
                  ]}
                  onPress={() => {
                    switch (button.label) {
                      case 'C':
                        clearDisplay();
                        break;
                      case '±':
                        toggleSign();
                        break;
                      case '%':
                        handlePercent();
                        break;
                      case '=':
                        handleEqual();
                        break;
                      case '+':
                      case '−':
                      case '×':
                      case '÷':
                        handleOperationPress(button.label);
                        break;
                      default:
                        handleNumberPress(button.label);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Animated.Text
                    style={[
                      styles.buttonText,
                      button.type === 'operator' && styles.operatorText,
                      button.type === 'function' && styles.functionText,
                      { transform: [{ scale: animation }] },
                    ]}
                  >
                    {button.label}
                  </Animated.Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');
const buttonSize = (width - 50) / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  gradient: {
    flex: 1,
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'transparent',
  },
  previousValue: {
    color: '#666666',
    fontSize: 30,
    textAlign: 'right',
    marginBottom: 10,
  },
  displayText: {
    color: '#FFFFFF',
    fontSize: 70,
    fontWeight: '300',
    textAlign: 'right',
  },
  buttonContainer: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    width: buttonSize,
    height: buttonSize,
    borderRadius: buttonSize / 2,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  doubleButton: {
    width: (buttonSize * 2) + 15,
    alignItems: 'flex-start',
    paddingLeft: 35,
  },
  operatorButton: {
    backgroundColor: '#FF9F0A',
  },
  functionButton: {
    backgroundColor: '#A5A5A5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '500',
  },
  operatorText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  functionText: {
    color: '#000000',
  },
});