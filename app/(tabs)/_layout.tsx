import React from "react";
import { Link, router, Stack, Tabs } from "expo-router";
import TabBar from "@/src/components/TabBar";
import { TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout () {
    return (
        <Tabs
            tabBar={props=> <TabBar {...props} />}
        >
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
                          <Ionicons name="help-circle-outline" size={34} color={Colors.dark} style ={{paddingLeft:15}} />
                        </TouchableOpacity>
                      </Link>
                    ),
                    
                    headerRight: () => (
                      <Link href={'(tabs)/notification'} asChild>
                        <TouchableOpacity>
                          <Ionicons name="notifications-circle-outline" size={34} color={Colors.dark} style ={{paddingRight:15}} />
                        </TouchableOpacity>
                      </Link>
                    ),
                  }}
            />
            <Tabs.Screen
                name="addTransactions"
                options={
                    {
                    title: 'Add',
                    headerTitle: 'Add Transaction',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: Colors.background },
                    
                    headerLeft: () => (
                      <Link href={'(tabs)/home'} asChild>
                        <TouchableOpacity>
                          <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} style ={{paddingLeft:15}} />
                        </TouchableOpacity>
                      </Link>
                    ),

                    }
                }
            />
            <Tabs.Screen
                name="budget"
                options={
                    {
                    title: 'Budget',
                    }
                }
            />
            <Tabs.Screen
                name="profile"
                options={
                    {
                    title: 'Profile',
                    }
                }
            />
   </Tabs>
   
    );
};
