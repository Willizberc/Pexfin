import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { db, auth } from "@/src/services/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { onAuthStateChanged } from 'firebase/auth';


const HomeScreen = () => {
    const [fullName, setFullName] = useState('');
    const [creditCardBalance, setCreditCardBalance] = useState(0);
    const [incomeAmount, setIncomeAmount] = useState(0);
    const [expenseAmount, setExpenseAmount] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async (userId: string) => {
            try {
                // Fetch user's full name
                const userDocRef = doc(db, 'Users', userId);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    const userData = userDocSnapshot.data();
                    setFullName(userData?.displayName || '');

                    // Fetch account balance with real-time listener
                    const accountsDocRef = doc(db, 'Accounts', userId); // Use userId as document ID
                    const unsubscribeAccount = onSnapshot(accountsDocRef, (accountDocSnapshot) => {
                        if (accountDocSnapshot.exists()) {
                            const accountData = accountDocSnapshot.data();
                            setCreditCardBalance(accountData?.balance || 0);
                        }
                    });

                    // Fetch transactions with real-time listener
                    const transactionsQuery = query(collection(db, 'Transactions'), where('userId', '==', userId));
                    const unsubscribeTransactions = onSnapshot(transactionsQuery, (transactionsSnapshot) => {
                        const fetchedTransactions: any[] = [];
                        let totalIncome = 0;
                        let totalExpense = 0;

                        transactionsSnapshot.forEach((transactionDoc) => {
                            const transactionData = transactionDoc.data();
                            fetchedTransactions.push(transactionData);
                            if (transactionData?.type === 'Income') {
                                totalIncome += transactionData?.amount || 0;
                            } else if (transactionData?.type === 'Expense') {
                                totalExpense += transactionData?.amount || 0;
                            }
                        });

                        setTransactions(fetchedTransactions);
                        setIncomeAmount(totalIncome);
                        setExpenseAmount(totalExpense);
                    });

                    // Clean up listeners on unmount
                    return () => {
                        unsubscribeAccount();
                        unsubscribeTransactions();
                    };
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserData(user.uid);
            } else {
                router.replace('/logIn');
            }
        });

        return unsubscribeAuth;
    }, [router]);

    const getFontSize = (amount: number) => {
        if (amount.toString().length > 7) {
            return 18;
        }
        return 24;
    };

    const formatDate = (date: Date) => {
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    };

    const formatAmount = (type: string, amount: number) => {
        const sign = type === 'Income' ? '+' : '-';
        return `${sign}$${amount.toFixed(2)}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome, {fullName}</Text>

            {/* Display Accounts balance */}
            <View style={[styles.card, styles.balanceCard]}>
                <View style={styles.iconTitleContainer}>
                    <Ionicons name="card-outline" size={34} color={Colors.smcardBackground}/>
                    <Text style={styles.creditCardTitle}>Balance</Text>
                </View>
                <Text style={[styles.cardAmount, { fontSize: getFontSize(creditCardBalance) }]}>
                    ${creditCardBalance.toFixed(2)}
                </Text>
            </View>

            {/* Display income and expense cards */}
            <View style={styles.row}>
                <TouchableOpacity style={styles.smallCard} onPress={() => router.push('screens/income')}>
                    <View style={styles.iconTitleContainer}>
                        <Ionicons name="trending-up-outline" size={34} color={Colors.icon} style={styles.icon} />
                        <Text style={styles.cardTitle}>Income</Text>
                    </View>
                    <Text style={[styles.smallCardAmount, { fontSize: getFontSize(incomeAmount) }]}>
                        ${incomeAmount.toFixed(2)}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.smallCard} onPress={() => router.push('screens/expense')}>
                    <View style={styles.iconTitleContainer}>
                        <Ionicons name="trending-down-outline" size={34} color={Colors.icon} style={styles.icon} />
                        <Text style={styles.cardTitle}>Expense</Text>
                    </View>
                    <Text style={[styles.smallCardAmount, { fontSize: getFontSize(expenseAmount) }]}>
                        ${expenseAmount.toFixed(2)}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Display transactions */}
            <Text style={styles.transactionsHeader}>Recent Transactions</Text>
            <FlatList
                data={transactions}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.transactionItem}>
                        <View>
                            <Text style={styles.transactionTitle}>{item.description}</Text>
                            <Text style={styles.transactionDate}>{formatDate(item.date.toDate())}</Text>
                        </View>
                        <Text style={styles.transactionAmount}>{formatAmount(item.type, item.amount)}</Text>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    card: {
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.primary,
        borderRadius: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        padding: 20,
        marginBottom: 20,
    },
    balanceCard: {
        alignItems: 'flex-start',
    },
    smallCard: {
        flex: 1,
        backgroundColor: Colors.smcardBackground,
        borderColor: Colors.primary,
        borderRadius: 12,
        borderStyle: 'solid',
        borderWidth: 0.5,
        padding: 20,
        marginBottom: 20,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    iconTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardContent: {
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    creditCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.smcardBackground,
        marginLeft: 10,
    },
    cardAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.smcardBackground,
    },
    smallCardAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    creditCardIcon: {
        color: Colors.smcardBackground,
    },
    icon: {
        color: Colors.icon,
    },
    transactionsHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
    transactionTitle: {
        fontSize: 16,
    },
    transactionDate: {
        fontSize: 14,
        color: Colors.gray,
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.transactionAmount,
    },
});

export default HomeScreen;
