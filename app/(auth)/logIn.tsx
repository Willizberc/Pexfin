import { defaultStyles } from "@/constants/Styles";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import Colors from "@/constants/Colors";
import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from "../../src/services/firebase"; // Adjusted import path

const Page = () => {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    // Function to handle user log in
    const onlogIn = async () => {
        try {
            setErrorMessage(''); // Clear previous error messages

            // Sign in with email and password using Firebase authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Redirect to the home screen or any other screen
            router.replace('/(tabs)/home');
        } catch (error) {
            console.error('Log In Error:', error);
            setErrorMessage('Invalid Credentials. Please Try Again'); // Set error message
        }
    };

    // Function to handle password reset
    const onForgotPassword = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email to reset the password.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert('Success', 'A password reset email has been sent to your email address.');
        } catch (error) {
            console.error('Password Reset Error:', error);
            Alert.alert('Error', 'Unable to send password reset email. Please check the email address.');
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={defaultStyles.container}>
                <Text style={defaultStyles.header}>Welcome Back!</Text>
                <Text style={defaultStyles.descriptionText}>
                    Log in to continue managing your finances with Pexfin
                </Text>
                <View style={styles.container}>
                    {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
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

                    {/* Forgot Password Link */}
                    <TouchableOpacity onPress={onForgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <Link href={'/signUp'} replace asChild>
                        <TouchableOpacity>
                            <Text style={defaultStyles.textLink}>Create an account. SignUp</Text>
                        </TouchableOpacity>
                    </Link>

                    <View style={{ flex: 1 }} />
                    <TouchableOpacity
                        style={[
                            defaultStyles.pillButton,
                            email && password ? styles.enabled : styles.disabled,
                            { marginBottom: 20, backgroundColor: email && password ? Colors.primary : Colors.primaryMuted }
                        ]}
                        onPress={onlogIn}
                        disabled={!email || !password}
                    >
                        <Text style={defaultStyles.buttonText}>Log In</Text>
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
    errorText: {
        color: 'red',
        marginBottom: 20,
        textAlign: 'center',
    },
    forgotPasswordText: {
        color: Colors.primary,
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 18,
    },
});

export default Page;
