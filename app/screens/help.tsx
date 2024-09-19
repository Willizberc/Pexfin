import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';

const faqData = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password by going to the profile section and selecting the "Change Password" option.',
  },
  {
    question: 'How do I add financial data?',
    answer: 'To add financial data, navigate to the profile screen and select "Add Financial Data".',
  },
  {
    question: 'What is Pexfin?',
    answer: 'Pexfin is a personal finance forecasting app that helps you manage and forecast your financial future.',
  },
  {
    question: 'How do I log out?',
    answer: 'To log out, go to your profile and click the "Log Out" button at the bottom of the screen.',
  },
  {
    question: 'Can I chat with a support representative?',
    answer: 'Yes, you can start a chat by going to the profile page and selecting the "Chat" option.',
  },
];

const HelpScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const [animation] = useState(new Animated.Value(0));

  const toggleFAQ = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setActiveIndex(index);
      Animated.timing(animation, {
        toValue: 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const filteredFAQs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Frequently Asked Questions</Text>
      
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.lightGray}
        />
      </View>

      {/* FAQ List */}
      <ScrollView contentContainerStyle={styles.faqContainer}>
        {filteredFAQs.map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <TouchableOpacity
              style={styles.faqHeader}
              onPress={() => toggleFAQ(index)}
            >
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={activeIndex === index ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
            {activeIndex === index && (
              <Animated.View style={[styles.faqAnswerContainer, { maxHeight: animation }]}>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </Animated.View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: Colors.dark,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    color: Colors.dark,
  },
  searchIcon: {
    marginRight: 5,
  },
  faqContainer: {
    paddingBottom: 40,
  },
  faqCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  faqAnswerContainer: {
    overflow: 'hidden',
    paddingTop: 10,
  },
  faqAnswer: {
    fontSize: 16,
    // color: Colors.darkGray,
    lineHeight: 22,
  },
});

export default HelpScreen;
