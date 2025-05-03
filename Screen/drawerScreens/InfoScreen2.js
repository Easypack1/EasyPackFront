import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const InfoScreen = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigation = useNavigation(); // 네비게이션 객체 가져오기

  const toggleSection = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const sections = [
    { title: '액체류 (국제선 출발, 환승에 한함)', content: `• 음료, 식품, 화장품 등 액체류(스프레이) 및 젤류(젤 또는 크림) 물품
• 개별 용기당 100ml 이하로 1인당 총 1L 용량의 비닐 지퍼백 1개` },
    { title: '의약품', content: '여행 중 필요한 개인용 의약품' },
    { title: 'MacBook 배터리 리콜 대상', content: '배터리 화재 위험이 있는 MacBook Pro (Retina, 15-inch, Mid 2015) 중 리콜하여 수리되지 않은 일부 제품은 국가/공항에 따라 항공기 운송(휴대/위탁) 금지 또는 휴대만 가능' },
    { 
        title: '기타',  content: `• 1인당 2.5kg 이하의 드라이아이스
  → 항공사의 승인을 받은 의료용품
• 1인당 12oz(350ml) 이하의 파우더류 물품 (미국 출도착편 및 호주 출발편)`
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>운송 제한 물품</Text>
      
      {/* 🔹 수평 정렬된 네비게이션 버튼 */}
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.navigate('InfoScreenStack')}>
          <AntDesign name="caretleft" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.item}>제한적 기내 반입 물품</Text>

        <TouchableOpacity onPress={() => navigation.navigate('InfoScreen3Stack')}>
          <AntDesign name="caretright" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        아래 품목은 기내로 소량 반입할 수 있습니다.
        <Text style={styles.warning}> (휴대 △, 위탁 O)</Text>
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
    backgroundColor: '#ffffff',
  },
  title: {
    color: 'navy',
    fontSize: 24,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 🔹 양쪽 정렬
    alignItems: 'center', // 🔹 수직 중앙 정렬
    marginTop: 30,
    paddingHorizontal: 20, // 🔹 좌우 여백 추가
  },
  item: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center', // 🔹 텍스트 중앙 정렬
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
