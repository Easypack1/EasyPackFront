import React from 'react';
import { TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const BackBtn = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <MaterialIcons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default BackBtn;
