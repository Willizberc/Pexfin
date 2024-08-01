import { defaultStyles } from "@/constants/Styles";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, setupDefaultData } from "@/src/services/firebase";

const SignUp = () => {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : Platform.OS === 'android' ? 100 : 0;
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const onsignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update user profile with full name
            await updateProfile(user, { displayName: fullName });

            // Call the setupDefaultData function
            await setupDefaultData(user.uid, fullName, email);

            // Redirect to the add financial data screen with userId
            router.replace({
                pathname: '/addFinancialData',
                params: { userId: user.uid }
            });
        } catch (error) {
            console.error('Sign Up Error:', error);
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Let's get started!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Sign up to get started with Pexfin and start managing your finances    
                </Text>
                <View style={styles.container}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            keyboardType="ascii-capable"
                            placeholderTextColor={Colors.gray}
                            value={fullName}
                            onChangeText={setFullName}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="black" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            keyboardType="email-address"
                            placeholderTextColor={Colors.gray}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="black" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            placeholderTextColor={Colors.gray}
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <Link href={'/logIn'} replace asChild>
                        <TouchableOpacity>
                            <Text style={defaultStyles.textLink}> Already have an account? Login</Text>
                        </TouchableOpacity>
                    </Link>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        style={[
                            defaultStyles.pillButton,
                            fullName && email && password ? styles.enabled : styles.disabled,
                            { marginBottom: 20, backgroundColor: fullName && email && password ? Colors.primary : Colors.primaryMuted }
                        ]}
                        onPress={onsignUp}
                        disabled={!fullName || !email || !password}
                    >
                        <Text style={defaultStyles.buttonText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40,
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
    enabled: {
        backgroundColor: Colors.primary,
    },
    disabled: {
        backgroundColor: Colors.primaryMuted,
    },
});

export default SignUp;
