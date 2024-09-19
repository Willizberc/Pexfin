import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Link, router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import 'react-native-reanimated';



// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
      
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
        name="screens/income" 
        options={{
          title: '',
          headerTitle: 'Income',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
                    
            headerLeft: () => (
                      <Link href={'/(tabs)/home'} asChild>
                        <TouchableOpacity>
                          <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} />
                        </TouchableOpacity>
                      </Link>
                    ),
          }} />
        <Stack.Screen 
        name="screens/expense" 
        options={{
          title: '',
          headerTitle: 'Expense',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
                    
            headerLeft: () => (
                      <Link href={'/(tabs)/home'} asChild>
                        <TouchableOpacity>
                          <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} />
                        </TouchableOpacity>
                      </Link>
                    ),
          }} />
        <Stack.Screen 
        name="screens/ChatbotScreen" 
        options={{
          title: '',
          headerTitle: 'PexBot',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
                    
            headerLeft: () => (
                      <Link href={'/(tabs)/home'} asChild>
                        <TouchableOpacity>
                          <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} />
                        </TouchableOpacity>
                      </Link>
                    ),
          }} />
        <Stack.Screen 
        name="screens/help" 
        options={{
          title: '',
          headerTitle: 'Help',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: Colors.background },
                    
            headerLeft: () => (
                      <Link href={'/(tabs)/home'} asChild>
                        <TouchableOpacity>
                          <Ionicons name="arrow-back-outline" size={34} color={Colors.dark} />
                        </TouchableOpacity>
                      </Link>
                    ),
          }} />
        <Stack.Screen 
          name="addFinancialData" 
          options={{ 
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
            headerRight: () => (
              <Link href={'/screens/help'} asChild>
                <TouchableOpacity>
                  <Ionicons name="help-circle-outline" size={34} color={Colors.dark} />
                </TouchableOpacity>
              </Link>
            ),
            }} />
         {/* Screen for the "signup" */}
        <Stack.Screen
          name="(auth)/signUp"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Screen for the "login" */}
        <Stack.Screen
          name="(auth)/logIn"
          options={{
            title: '',
            headerBackTitle: '',
            headerShadowVisible: false,
            headerStyle: { backgroundColor: Colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" size={34} color={Colors.dark} />
              </TouchableOpacity>
            ),
          }}
        />
    </Stack>
    
  );
}

