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
    { title: '파손 또는 손상되기 쉬운 물품', content: '도자기, 액자, 유리제품 등' },
    { title: '고가품 및 귀중품', content: '화폐, 보석, 현금, 유가증권, 견본, 서류, 전자제품 등' },
    { title: '여객기로 운송 가능한 휴대용 전자기기의 보조/여분 배터리는 휴대만 가능', content: '니켈수소, 니켈카드뮴, 망간 등' },
    { 
      title: '보조/여분 리튬배터리', 
      content: `• 배터리 용량이 160Wh 이하이며 단락 방지 포장된 여분/보조 배터리
  →100Wh 이하 배터리 : 1인 5개 제한
  →100Wh 초과 160Wh 이하 배터리 : 1인 2개 제한 (항공사 승인을 위해 체크인 카운터 방문 필요)
      * 배터리 용량이 상기 조건을 초과하거나 확인이 불가할 경우 운송이 거절될 수 있습니다. (위탁, 휴대 모두 불가)
      * 해외 출발편의 경우 공항/국가별 별도의 강화된 규정이 적용될 수 있습니다.
• 배터리는 절연테이프 처리 또는 1개당 1개의 지퍼형 투명 비닐백(개별 준비)에 지입 후 직접 휴대해야 하며, 기내 선반에 보관하는 것은 엄격히 금지됩니다.`
    },
    { 
      title: '라이터/전자담배', 
      content: `• 1인당 1개 이하의 라이터 및 안전성냥
  → 라이터는 반드시 몸에 소지 (휴대 가방 내 지입 불가)
  → 토치라이터, 플라즈마 라이터는 항공기 반입 금지
  → 중국 출발편의 경우 휴대/위탁 모두 불가
• 배터리 용량이 100Wh 이하인 전자담배
  → 기내에서 충전/사용 및 기내 선반 보관 금지`
    }
    

  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>운송 제한 물품</Text>
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('InfoScreen2Stack')}>
      <AntDesign name="caretleft" size={24} color="black" />
        <Text style={styles.item}>위탁 수하물 제한 물품</Text>
              </TouchableOpacity>
      <Text style={styles.description}>
      아래 품목은 수하물로 위탁할 수 없으므로, 직접 휴대해 주세요.
        <Text style={styles.warning}> (휴대 O, 위탁 X)</Text>
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
    backgroundColor: '#f9f9f9',
  },
  title: {
    color: 'navy',
    fontSize: 24,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  item: {
    fontSize: 20,
    marginHorizontal: 65,
    fontWeight: 'bold',
    textAlign: 'center',
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
  // 새로운 스타일 추가
  noticeContainer: {
    marginTop: 40, // 아코디언 버튼 밑에 여백 추가
  },
  noticeTitle: {
    fontSize: 18,
    color: 'navy', // 남색
    fontWeight: 'bold',
  },
  noticeText: {
    fontSize: 14,
    color: '#333', // 검정색
    marginTop: 10,
  },
});

export default InfoScreen;

