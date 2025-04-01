import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useNavigation } from '@react-navigation/native'; // 추가

const InfoScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const sections = [
    { title: '발화성/인화성 물질', content: '휘발유, 페인트, 라이터용 연료 등 발화성/인화성 물질' },
    { title: '고압가스 용기', content: '부탄가스캔 등 고압가스 용기' },
    { title: '무기 및 폭발물 종류', content: '총기, 폭죽 등 무기 및 폭발물 종류' },
    { title: '기타 위험 물질', content: '소화기, 에어로졸(살충제 등), 락스 등 탑승객 및 항공기에 위험이 될 가능성이 있는 물질' },
    { 
      title: '리튬 배터리 장착 전자기기', 
      content: `• 배터리 용량 160Wh 초과의 리튬 배터리가 장착된 전자기기
  → 전동휠체어 등의 교통약자용 보행 보조기구는 예외
• 배터리 용량 160Wh 초과의 보조/여분의 리튬 배터리
• 리튬 배터리가 분리되지 않는 일체형 전동 휠, 스마트 가방
  → 단, 배터리를 분리할 수 있으며 용량이 160Wh 이하인 경우는 배터리 분리하여 배터리 휴대 (기내 사용 금지 및 전원 off)
  → 전동휠체어 등의 교통약자용 보행 보조기구는 예외
• 배터리 분리가 불가한 헤어컬(고데기)
  → 일본 출발편 한정`
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>운송 제한 물품</Text>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('InfoScreen2Stack')}>
        <Text style={styles.item}>항공기 반입 금지 물품</Text>
        <AntDesign name="caretright" size={24} color="black" />
      </TouchableOpacity>
      
      <Text style={styles.description}>
        아래 품목은 휴대 수하물로 기내 반입하거나 위탁 수하물로 운송하는 것이 금지되어 있습니다.
        <Text style={styles.warning}> (휴대 X, 위탁 X)</Text>
      </Text>

      {/* 아코디언 버튼 리스트 */}
      {sections.map((section, index) => (
        <View key={index}>
          <TouchableOpacity style={styles.button} onPress={() => toggleSection(index)}>
            <Text style={styles.buttonText}>{section.title}</Text>
          </TouchableOpacity>
          <Collapsible collapsed={activeIndex !== index}>
            <View style={styles.content}>
              <Text style={styles.contentText}>{section.content}</Text>
            </View>
          </Collapsible>
        </View>
      ))}

      {/* "알아두세요" 문구 추가 */}
      <View style={styles.noticeContainer}>
        <Text style={styles.noticeTitle}>알아두세요</Text>
        <Text style={styles.noticeText}>
          공항의 보안검색 감독자가 항공기 안전 및 승객, 승무원에 위해를 줄 수 있다고 판단하는 경우 해당 물품의 운송이 제한되며 항공사는 이를 준수할 의무가 있습니다.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    color: 'navy',
    fontSize: 24,
    marginLeft: 10,
    marginTop: 20,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  item: {
    fontSize: 20,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'left',
  },
  warning: {
    color: 'red',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'navy',
    padding: 12,
    borderRadius: 3,
    marginTop: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'navy',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
  },
  contentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  noticeContainer: {
    marginTop: 40,
  },
  noticeTitle: {
    fontSize: 18,
    color: 'navy',
    fontWeight: 'bold',
  },
  noticeText: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
});

export default InfoScreen;
