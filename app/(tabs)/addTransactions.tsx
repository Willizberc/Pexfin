import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Colors from "@/constants/Colors";
import { db, auth } from "@/src/services/firebase";
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const AddTransactions = () => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [transactionType, setTransactionType] = useState('');
    const [userId, setUserId] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                router.replace('/logIn');
            }
        });

        return unsubscribe;
    }, []);

    const updateAccountBalance = async (amountNum: number, type: string) => {
        const accountRef = doc(db, 'Accounts', userId);
        const accountSnap = await getDoc(accountRef);

        if (accountSnap.exists()) {
            let currentBalance = accountSnap.data().balance;

            if (type === 'Income') {
                currentBalance += amountNum;
            } else if (type === 'Expense') {
                currentBalance -= amountNum;
            }

            await updateDoc(accountRef, { balance: currentBalance });
        } else {
            console.error("No such account!");
            alert("Error updating account balance");
        }
    };

    const addTransaction = async () => {
        if (!description || !amount || !transactionType) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const amountNum = parseFloat(amount);

            // Add transaction to Transactions collection
            await addDoc(collection(db, 'Transactions'), {
                userId,
                description,
                amount: amountNum,
                date: new Date(),
                type: transactionType
            });

            // Update Users subcollection based on transaction type
            if (transactionType === 'Income') {
                await addDoc(collection(db, 'Users', userId, 'Income'), {
                    source: description,
                    amount: amountNum,
                    date: new Date(),
                    description
                });
            } else if (transactionType === 'Expense') {
                await addDoc(collection(db, 'Users', userId, 'Expenses'), {
                    category: description,
                    amount: amountNum,
                    date: new Date(),
                    description
                });
            }

            // Update account balance
            await updateAccountBalance(amountNum, transactionType);

            alert('Transaction added successfully');
            setDescription('');
            setAmount('');
            setTransactionType('');
        } catch (error) {
            console.error("Error adding transaction: ", error);
            alert("Error adding transaction");
        }
    };

    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Add Transaction</Text> */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholderTextColor={Colors.gray}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    placeholderTextColor={Colors.gray}
                />
            </View>
            <TouchableOpacity style={styles.pickerContainer} onPress={() => setShowPicker(!showPicker)}>
                <Text style={[styles.pickerText, transactionType ? styles.selectedText : styles.placeholderText]}>
                    {transactionType ? transactionType : 'Choose transaction type'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={Colors.gray} />
            </TouchableOpacity>
            {showPicker && (
                <Picker
                    selectedValue={transactionType}
                    onValueChange={(itemValue) => {
                        setTransactionType(itemValue);
                        setShowPicker(false);
                    }}
                    style={styles.picker}
                >
                    <Picker.Item label="Income" value="Income" />
                    <Picker.Item label="Expense" value="Expense" />
                </Picker>
            )}
            <TouchableOpacity
                style={[styles.button, showPicker ? { marginTop: 20 } : null]}
                onPress={addTransaction}
            >
                <Text style={styles.buttonText}>Add Transaction</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.background,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: Colors.dark,
    },
    pickerContainer: {
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    pickerText: {
        fontSize: 16,
        color: Colors.dark,
    },
    placeholderText: {
        color: Colors.gray,
    },
    selectedText: {
        color: Colors.dark,
    },
    picker: {
        width: '100%',
        color: Colors.dark,
        backgroundColor: Colors.lightGray,
        borderRadius: 8,
    },
    button: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddTransactions;
