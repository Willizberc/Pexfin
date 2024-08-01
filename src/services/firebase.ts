import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDmkVIYRUc-2tyYQHmt2yLpa1k3q0KFfI8",
  authDomain: "pexfin-74a73.firebaseapp.com",
  projectId: "pexfin-74a73",
  storageBucket: "pexfin-74a73.appspot.com",
  messagingSenderId: "294321010745",
  appId: "1:294321010745:web:ec2a71bda178b80b9475e8"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export async function setupDefaultData(userId: string, displayName: string, email: string) {
  // Users collection
  const usersRef = doc(collection(db, 'Users'), userId);
  await setDoc(usersRef, {
    displayName,
    email,
    profilePicture: '',
    createdAt: new Date(),
    lastLogin: new Date()
  });

  // Account collection (one per user)
  const accountRef = doc(collection(db, 'Accounts'), userId); // Use userId as the document ID
  await setDoc(accountRef, {
    userId: userId,
    name: '',
    type: '',
    balance: 0,
    currency: '',
    createdAt: new Date()
  });

  // Transactions collection, TransactionID should be auto generated
  await addDoc(collection(db, 'Transactions'), {
    accountId: userId, // Link to the account document
    date: new Date(),
    description: '',
    amount: 0,
    category: '',
    type: '',
    isRecurring: false,
    recurringFrequency: ''
  });

  // Budgets subcollection under Users, BudgetID should be auto generated
  await addDoc(collection(db, 'Users', userId, 'Budgets'), {
    name: '',
    targetAmount: 0,
    startDate: new Date(),
    endDate: new Date(),
    categories: []
  });

  // Goals subcollection under Users, GoalID should be auto generated
  await addDoc(collection(db, 'Users', userId, 'Goals'), {
    name: '',
    targetAmount: 0,
    startDate: new Date(),
    endDate: new Date(),
    progress: 0
  });

  // Income subcollection under Users, IncomeID should be auto generated
  await addDoc(collection(db, 'Users', userId, 'Income'), {
    source: '',
    amount: 0,
    date: new Date(),
    description: ''
  });

  // Expenses subcollection under Users, ExpensesID should be auto generated
  await addDoc(collection(db, 'Users', userId, 'Expenses'), {
    category: '',
    amount: 0,
    date: new Date(),
    description: ''
  });
}

export { auth, db };
