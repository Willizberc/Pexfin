import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    KeyboardAvoidingView, 
    Platform
} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import { Ionicons } from '@expo/vector-icons';
import { speak, isSpeakingAsync, stop } from "expo-speech";

const Chatbot = () => {
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = "AIzaSyCi_SdrEm1tk83VNy4qn8wVjjSoEBMtMpA";

    const handleUserInput = async () => {
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];

        setChat(updatedChat); // Add user's message to the chat
        setUserInput(""); // Clear the input field
        setLoading(true); // Start loading

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
                { contents: updatedChat }
            );

            const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (modelResponse) {
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ];
                setChat(updatedChatWithModel); // Add bot response to the chat
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            stop();
            setIsSpeaking(false);
        } else {
            if (!(await isSpeakingAsync())) {
                speak(text);
                setIsSpeaking(true);
            }
        }
    };

    const renderChatItem = ({ item }) => (
        <ChatBubble 
            role={item.role} 
            text={item.parts[0].text}
            onSpeech={() => handleSpeech(item.parts[0].text)}
        />
    );

    const renderLoadingBubble = () => (
        <View style={styles.loadingBubble}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingText}>Typing...</Text>
        </View>
    );

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
            <View style={styles.container}>
                <FlatList
                    data={loading ? [...chat, { role: 'loading' }] : chat} // Append loading bubble when loading
                    renderItem={({ item }) => {
                        if (item.role === 'loading') return renderLoadingBubble(); // Show the loading bubble
                        return renderChatItem({ item });
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.chatContainer}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="#aaa"
                        value={userInput}
                        onChangeText={setUserInput}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleUserInput}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                {error && <Text style={styles.error}>{error}</Text>}
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        flex: 1,
        height: 50,
        marginRight: 10,
        padding: 8,
        borderColor: "#333",
        borderWidth: 1,
        borderRadius: 25,
        color: "#333",
        backgroundColor: "#fff",
    },
    button: {
        padding: 15,
        backgroundColor: "#0891b2",
        borderRadius: 50, // Fully rounded button
        justifyContent: "center",
        alignItems: "center",
        width: 50, // Adjust size to fit the icon
        height: 50,
    },
    loadingBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#626D77',
        padding: 10,
        borderRadius: 10,
        maxWidth: '75%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    loadingText: {
        color: '#fff',
        marginLeft: 10,
        fontSize: 16,
    },
    error: {
        color: "red",
        marginTop: 10,
    },
});

export default Chatbot;
