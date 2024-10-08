import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { db, auth } from '@/src/services/firebase';
import { collection, query, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Colors from '@/constants/Colors';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { defaultStyles } from '@/constants/Styles';

const BudgetScreen = () => {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetAmount, setNewBudgetAmount] = useState('');
  const [newBudgetStartDate, setNewBudgetStartDate] = useState(new Date());
  const [newBudgetEndDate, setNewBudgetEndDate] = useState(new Date());
  const [editingBudget, setEditingBudget] = useState<any>(null);

  useEffect(() => {
    const fetchBudgets = async (userId: string) => {
      try {
        const budgetsQuery = query(collection(db, 'Users', userId, 'Budgets'));
        const budgetsSnapshot = await getDocs(budgetsQuery);

        const fetchedBudgets: any[] = [];
        budgetsSnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedBudgets.push({
            id: doc.id,
            ...data,
            startDate: data.startDate.toDate(),
            endDate: data.endDate.toDate(),
          });
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
        let budgetId: string;
        if (editingBudget) {
          await updateDoc(doc(db, 'Users', user.uid, 'Budgets', editingBudget.id), {
            name: newBudgetName,
            targetAmount: parseFloat(newBudgetAmount),
            startDate: newBudgetStartDate,
            endDate: newBudgetEndDate,
          });
          budgetId = editingBudget.id;
        } else {
          const docRef = await addDoc(collection(db, 'Users', user.uid, 'Budgets'), {
            name: newBudgetName,
            targetAmount: parseFloat(newBudgetAmount),
            startDate: newBudgetStartDate,
            endDate: newBudgetEndDate,
          });
          budgetId = docRef.id;
        }

        // Update the local state immediately
        const newBudget = {
          id: budgetId,
          name: newBudgetName,
          targetAmount: parseFloat(newBudgetAmount),
          startDate: newBudgetStartDate,
          endDate: newBudgetEndDate,
        };

        if (editingBudget) {
          setBudgets((prevBudgets) =>
            prevBudgets.map((budget) => (budget.id === budgetId ? newBudget : budget))
          );
        } else {
          setBudgets((prevBudgets) => [...prevBudgets, newBudget]);
        }

        setShowModal(false);
        setNewBudgetName('');
        setNewBudgetAmount('');
        setNewBudgetStartDate(new Date());
        setNewBudgetEndDate(new Date());
        setEditingBudget(null);
      }
    } catch (error) {
      console.error('Error adding/updating budget:', error);
    }
  };

  const editBudget = (budget: any) => {
    setEditingBudget(budget);
    setNewBudgetName(budget.name);
    setNewBudgetAmount(budget.targetAmount.toString());
    setNewBudgetStartDate(budget.startDate);
    setNewBudgetEndDate(budget.endDate);
    setShowModal(true);
  };

  const deleteBudget = async (budgetId: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        await deleteDoc(doc(db, 'Users', user.uid, 'Budgets', budgetId));
        // Update the local state immediately
        setBudgets((prevBudgets) => prevBudgets.filter((budget) => budget.id !== budgetId));
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
    }
  };

  return (
    <View style={[defaultStyles.container, localStyles.container]}>
      <View style={localStyles.summaryContainer}>
        <View style={localStyles.summaryBox}>
          <MaterialIcons name="attach-money" size={24} color="green" />
          <Text style={localStyles.summaryTitle}>Income</Text>
          <Text style={localStyles.summaryAmount}>+${income.toLocaleString()}</Text>
        </View>
        <View style={localStyles.summaryBox}>
          <MaterialIcons name="money-off" size={24} color="red" />
          <Text style={localStyles.summaryTitle}>Expense</Text>
          <Text style={localStyles.summaryAmount}>-${expenses.toLocaleString()}</Text>
        </View>
      </View>
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={localStyles.budgetItem}>
            <View style={localStyles.budgetDetails}>
              <Text style={localStyles.budgetName}>{item.name || 'Unnamed Budget'}</Text>
              <Text style={localStyles.budgetAmount}>${(item.targetAmount ?? 0).toLocaleString()}</Text>
              <Text style={localStyles.budgetTime}>Start: {item.startDate.toLocaleDateString()}</Text>
              <Text style={localStyles.budgetTime}>End: {item.endDate.toLocaleDateString()}</Text>
            </View>
            <View style={localStyles.actions}>
              <TouchableOpacity onPress={() => editBudget(item)}>
                <FontAwesome name="edit" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteBudget(item.id)}>
                <FontAwesome name="trash" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={localStyles.floatingButton} onPress={() => setShowModal(true)}>
        <FontAwesome name="plus" size={30} color="#fff" />
      </TouchableOpacity>
      <Modal visible={showModal} animationType="slide">
        <View style={defaultStyles.container}>
          <Text style={localStyles.modalTitle}>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</Text>
          <TextInput
            style={localStyles.input}
            placeholder="Budget Name"
            value={newBudgetName}
            onChangeText={setNewBudgetName}
          />
          <TextInput
            style={localStyles.input}
            placeholder="Budget Amount"
            value={newBudgetAmount}
            onChangeText={setNewBudgetAmount}
            keyboardType="numeric"
          />
          <View style={localStyles.datePickerContainer}>
            <Text style={localStyles.label}>Start Date</Text>
            <DateTimePicker
              value={newBudgetStartDate}
              mode="date"
              display="default"
              onChange={(event, date) => date && setNewBudgetStartDate(date)}
              style={localStyles.datePicker}
            />
          </View>
          <View style={localStyles.datePickerContainer}>
            <Text style={localStyles.label}>End Date</Text>
            <DateTimePicker
              value={newBudgetEndDate}
              mode="date"
              display="default"
              onChange={(event, date) => date && setNewBudgetEndDate(date)}
              style={localStyles.datePicker}
            />
          </View>
          <TouchableOpacity
            style={[defaultStyles.pillButton, { backgroundColor: Colors.primary, marginTop: 20 }]}
            onPress={addNewBudget}
          >
            <Text style={defaultStyles.buttonText}>{editingBudget ? 'Update Budget' : 'Add Budget'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.pillButton, { backgroundColor: Colors.gray, marginTop: 10 }]}
            onPress={() => { setShowModal(false); setEditingBudget(null); }}
          >
            <Text style={defaultStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetDetails: {
    flex: 1,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#fff',
  },
  budgetTime: {
    fontSize: 12,
    color: '#ddd',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 60,
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: Colors.dark,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 90,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
  },
  input: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  datePicker: {
    backgroundColor: '#fff',
    borderRadius: 5,
  },
});

export default BudgetScreen;
