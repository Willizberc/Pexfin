// (tabs)/_layout.tsx

import React, { useState, useEffect } from "react";
import { Link, router, Tabs } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import Colors from "@/constants/Colors";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { db, auth } from "@/src/services/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import TabBar from "@/src/components/TabBar";
import { onAuthStateChanged } from "@firebase/auth";

export default function TabLayout() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const fetchNotifications = async (userId: string) => {
      const notificationsQuery = query(collection(db, 'Notifications'), where('userId', '==', userId), where('read', '==', false));
      const unsubscribeNotifications = onSnapshot(notificationsQuery, (notificationsSnapshot) => {
        setHasUnread(notificationsSnapshot.size > 0);
      });

      return () => unsubscribeNotifications();
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchNotifications(user.uid);
      }
    });

    return unsubscribeAuth;
  }, []);

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
          headerLeft: () => (
            <Link href={'(tabs)/help'} asChild>
              <TouchableOpacity>
                <Ionicons name="help-circle-outline" size={34} color={Colors.dark} style={{ paddingLeft: 15 }} />
              </TouchableOpacity>
            </Link>
          ),
          headerRight: () => (
            <Link href={'screens/ChatbotScreen'} asChild>
              <TouchableOpacity>
                <View>
                  <FontAwesome6 name="robot" size={34} color={Colors.dark} style={{ paddingRight: 15 }} />
                </View>
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="addTransactions"
        options={{
          title: 'Add',
          headerTitle: 'Add Transaction',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.smcardBackground },
          headerLeft: () => (
            <Link href={'(tabs)/home'} asChild>
              <TouchableOpacity>
                <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} style={{ paddingLeft: 15 }} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          headerTitle: 'Budget',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.smcardBackground },
          headerLeft: () => (
            <Link href={'(tabs)/home'} asChild>
              <TouchableOpacity>
                <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} style={{ paddingLeft: 15 }} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.smcardBackground },
          headerLeft: () => (
            <Link href={'(tabs)/home'} asChild>
              <TouchableOpacity>
                <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} style={{ paddingLeft: 15 }} />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
