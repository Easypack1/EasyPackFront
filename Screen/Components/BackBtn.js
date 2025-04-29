import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const BackBtn = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
      <Image
       source={require('../../Image/back-btn.png')}
       style={[styles.icon,]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24, // 이미지 크기 조정 가능
    height: 24, // 이미지 크기 조정 가능
    resizeMode: 'contain',
  },
});

export default BackBtn;
