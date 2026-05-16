import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../styles/theme';

export default function FloatingControls({
  undo,
  history,
  settings,
}: any) {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.btn} onPress={undo}>
        <Text style={styles.text}>UNDO</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={history}>
        <Text style={styles.text}>HISTORY</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={settings}>
        <Text style={styles.text}>SETTINGS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    backgroundColor: '#08101C',
    borderWidth: 1,
    borderColor: '#1E293B',
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.text,
    fontWeight: '900',
  },
});