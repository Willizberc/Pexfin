import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { db, auth } from '@/src/services/firebase';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Colors from '@/constants/Colors';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const BudgetScreen = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetTime, setNewBudgetTime] = useState('');

  useEffect(() => {
    const fetchBudgets = async (userId: string) => {
      try {
        const budgetsQuery = query(collection(db, 'Users', userId, 'Budgets'));
        const budgetsSnapshot = await getDocs(budgetsQuery);

        const fetchedBudgets: any[] = [];
        budgetsSnapshot.forEach((doc) => {
          fetchedBudgets.push({ id: doc.id, ...doc.data() });
        });

        setBudgets(fetchedBudgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    const fetchIncomeAndExpenses = async (userId: string) => {
      try {
        const incomeQuery = query(collection(db, 'Users', userId, 'Income'));
        const incomeSnapshot = await getDocs(incomeQuery);

        let totalIncome = 0;
        incomeSnapshot.forEach((doc) => {
          totalIncome += doc.data().amount;
        });
        setIncome(totalIncome);

        const expensesQuery = query(collection(db, 'Users', userId, 'Expenses'));
        const expensesSnapshot = await getDocs(expensesQuery);

        let totalExpenses = 0;
        expensesSnapshot.forEach((doc) => {
          totalExpenses += doc.data().amount;
        });
        setExpenses(totalExpenses);
      } catch (error) {
        console.error('Error fetching income and expenses:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchBudgets(user.uid);
        fetchIncomeAndExpenses(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  const addNewBudget = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'Users', user.uid, 'Budgets'), {
          name: newBudgetName,
          targetAmount: parseFloat(newBudgetAmount),
          time: newBudgetTime,
          spent: 0, // Initial spent amount
        });
        setShowModal(false);
        setNewBudgetName('');
        setNewBudgetAmount('');
        setNewBudgetTime('');
      }
    } catch (error) {
      console.error('Error adding new budget:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <MaterialIcons name="attach-money" size={24} color="green" />
          <Text style={styles.summaryTitle}>Income</Text>
          <Text style={styles.summaryAmount}>+${income.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <MaterialIcons name="money-off" size={24} color="red" />
          <Text style={styles.summaryTitle}>Expense</Text>
          <Text style={styles.summaryAmount}>-${expenses.toFixed(2)}</Text>
        </View>
      </View>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.budgetItem}>
            <Text style={styles.budgetName}>{item.name || 'Unnamed Budget'}</Text>
            <Text style={styles.budgetAmount}>${(item.targetAmount ?? 0).toFixed(2)}</Text>
            <Text style={styles.budgetTime}>{item.time || 'No time specified'}</Text>
            <Text style={styles.budgetSpent}>Total Spent [${(item.spent ?? 0).toFixed(2)}]</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.floatingButton} onPress={() => setShowModal(true)}>
        <FontAwesome name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Create New Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="Budget Name"
            value={newBudgetName}
            onChangeText={setNewBudgetName}
          />
          <TextInput
            style={styles.input}
            placeholder="Budget Amount"
            value={newBudgetAmount}
            onChangeText={setNewBudgetAmount}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Budget Time"
            value={newBudgetTime}
            onChangeText={setNewBudgetTime}
          />
          <Button title="Add Budget" onPress={addNewBudget} />
          <Button title="Cancel" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.background,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#777',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  budgetItem: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  budgetAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 5,
  },
  budgetTime: {
    fontSize: 14,
    color: '#fff',
  },
  budgetSpent: {
    fontSize: 14,
    color: '#fff',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default BudgetScreen;
