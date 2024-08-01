// src/screens/addFinancialData.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db } from '@/src/services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Colors from '@/constants/Colors';

const AddFinancialData = () => {
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [balance, setBalance] = useState('');
    const [currency, setCurrency] = useState('');
    const router = useRouter();
    const { userId } = useLocalSearchParams(); // Retrieve userId from route parameters

    const handleAddData = async () => {
        if (!userId) {
            console.error('Error: User ID is undefined');
            return;
        }

        try {
            // Use the userId to refer to the user's account
            const accountRef = doc(db, 'Accounts', userId);
            await setDoc(accountRef, {
                userId: userId as string,
                name: accountName,
                type: accountType,
                balance: parseFloat(balance),
                currency: currency,
                createdAt: new Date()
            }, { merge: true }); // Use merge to update existing data or create a new document

            router.replace('(tabs)/home');
        } catch (error) {
            console.error('Error adding financial data:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Financial Data</Text>
            <View style={styles.inputContainer}>
                <Ionicons name="wallet-outline" size={24} color={Colors.icon} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Account Name"
                    value={accountName}
                    onChangeText={setAccountName}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="list-outline" size={24} color={Colors.icon} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Account Type"
                    value={accountType}
                    onChangeText={setAccountType}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="cash-outline" size={24} color={Colors.icon} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Balance"
                    keyboardType="numeric"
                    value={balance}
                    onChangeText={setBalance}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="pricetag-outline" size={24} color={Colors.icon} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Currency"
                    value={currency}
                    onChangeText={setCurrency}
                />
            </View>
            <TouchableOpacity
                style={[
                    styles.button,
                    accountName && accountType && balance && currency ? styles.enabled : styles.disabled
                ]}
                onPress={handleAddData}
                disabled={!accountName || !accountType || !balance || !currency}
            >
                <Text style={styles.buttonText}>Add Data</Text>
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
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        backgroundColor: Colors.lightGray,
        borderRadius: 16,
        padding: 20,
        paddingLeft: 50,
        fontSize: 20,
        flex: 1,
        color: Colors.dark,
        borderColor: Colors.gray,
    },
    icon: {
        position: 'absolute',
        top: 17.5,
        left: 8,
        color: Colors.gray,
        zIndex: 1,
    },
    button: {
        padding: 20,
        borderRadius: 16,
        backgroundColor: Colors.primary,
    },
    buttonText: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    },
});

export default AddFinancialData;
