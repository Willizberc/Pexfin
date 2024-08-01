// src/components/TransactionLists.tsx
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { db, auth } from "@/src/services/firebase";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Transaction {
    id: string;
    description: string;
    amount: number;
    date: Date;
    type: string; // 'Income' or 'Expense'
}

const TransactionLists = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async (userId: string) => {
            try {
                // Fetch accounts for the user
                const accountsQuery = query(collection(db, 'Accounts'), where('userId', '==', userId));
                const accountsSnapshot = await getDocs(accountsQuery);
                const accountIds = accountsSnapshot.docs.map(doc => doc.id);

                if (accountIds.length > 0) {
                    // Fetch transactions for the accounts
                    const transactionsQuery = query(collection(db, 'Transactions'), where('accountId', 'in', accountIds));
                    const transactionsSnapshot = await getDocs(transactionsQuery);

                    const fetchedTransactions: Transaction[] = [];
                    transactionsSnapshot.forEach((transactionDoc) => {
                        const transactionData = transactionDoc.data();
                        fetchedTransactions.push({
                            id: transactionDoc.id,
                            description: transactionData.description || '',
                            amount: transactionData.amount || 0,
                            date: transactionData.date.toDate() || new Date(),
                            type: transactionData.type || 'Expense',
                        });
                    });

                    setTransactions(fetchedTransactions);
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchTransactions(user.uid);
            } else {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Recent Transactions</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.transactionItem}>
                        <View style={styles.transactionDetails}>
                            <Text style={styles.transactionDescription}>{item.description}</Text>
                            <Text style={styles.transactionDate}>{item.date.toLocaleDateString()}</Text>
                        </View>
                        <Text style={[
                            styles.transactionAmount,
                            item.type === 'Income' ? styles.incomeAmount : styles.expenseAmount
                        ]}>
                            ${item.amount.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    transactionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colors.transactionBackground,
        borderRadius: 8,
        marginBottom: 10,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 16,
    },
    transactionDate: {
        fontSize: 14,
        color: Colors.gray,
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    incomeAmount: {
        color: Colors.income,
    },
    expenseAmount: {
        color: Colors.expense,
    },
});

export default TransactionLists;
