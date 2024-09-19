import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { db, auth } from '@/src/services/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import MonthPicker from 'react-native-month-picker';

const screenWidth = Dimensions.get('window').width;

const IncomeScreen = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  useEffect(() => {
    const fetchIncomeData = async (userId: string) => {
      try {
        const incomeQuery = query(collection(db, 'Users', userId, 'Income'));
        const incomeSnapshot = await getDocs(incomeQuery);

        let totalIncome = 0;
        const dailyIncome: { [date: string]: number } = {};
        const fetchedTransactions: any[] = [];

        incomeSnapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.date.seconds * 1000);
          if (
            date.getMonth() === selectedMonth.getMonth() &&
            date.getFullYear() === selectedMonth.getFullYear()
          ) {
            fetchedTransactions.push(data);
            const dateString = date.toLocaleDateString();
            if (!dailyIncome[dateString]) {
              dailyIncome[dateString] = 0;
            }
            dailyIncome[dateString] += data.amount;
            totalIncome += data.amount;
          }
        });

        setTotalIncome(totalIncome);
        setTransactions(fetchedTransactions);

        const labels = Object.keys(dailyIncome).sort();
        const data = labels.map((label) => dailyIncome[label]);

        setLabels(labels);
        setIncomeData(data);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchIncomeData(user.uid);
      }
    });

    return unsubscribe;
  }, [selectedMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Incomes</Text>
        <Text style={styles.totalIncome}>${totalIncome.toLocaleString()}</Text>
        <ScrollView horizontal>
          <BarChart
            data={{
              labels: labels,
              datasets: [{ data: incomeData }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: 'transparent',
              backgroundGradientFrom: '#0891b2',
              backgroundGradientTo: '#feb47b',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 5) => `rgba(255, 255, 255, ${opacity})`,
              barPercentage: 0.9,
              propsForBackgroundLines: {
                strokeWidth: 0.5,
                stroke: 'rgba(255, 255, 255, 0.2)',
                strokeDasharray: '4',
              },
            }}
            style={styles.chart}
          />
        </ScrollView>
        <TouchableOpacity
          style={styles.monthToggle}
          onPress={() => setShowMonthPicker(true)}
        >
          <Text style={styles.monthText}>Month</Text>
        </TouchableOpacity>
        {showMonthPicker && (
          <MonthPicker
            selectedDate={selectedMonth}
            onMonthChange={(date) => {
              setSelectedMonth(date);
              setShowMonthPicker(false);
            }}
            onCancel={() => setShowMonthPicker(false)}
          />
        )}
        <Text style={styles.spendsStatistic}>Income statistic</Text>
      </View>
      <View style={styles.transactionsHeaderContainer}>
        <Text style={styles.transactionsHeader}>This Month</Text>
        <TouchableOpacity onPress={() => console.log('See all transactions')}>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item, index) => `${index}`}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View>
              <Text style={styles.transactionTitle}>{item.description}</Text>
              <Text style={styles.transactionDate}>{new Date(item.date.seconds * 1000).toLocaleString()}</Text>
            </View>
            <Text style={styles.transactionAmount}>+${item.amount.toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.chartCardBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  totalIncome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  chart: {
    marginTop: 20,
    borderRadius: 10,
  },
  monthToggle: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    position: 'absolute',
    top: 10,
    right: 10,
  },
  monthText: {
    color: '#ffffff',
    fontSize: 16,
  },
  spendsStatistic: {
    color: Colors.primary,
    marginTop: 10,
  },
  transactionsHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  transactionsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#007aff',
    fontSize: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    // backgroundColor: Colors.transactionBackground,
    borderRadius: 8,
    marginBottom: 10,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  transactionDate: {
    fontSize: 14,
    // color: Colors.date,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.incomeAmount,
  },
});

export default IncomeScreen;
