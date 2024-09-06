import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ChatBubble = ({ role, text, onSpeech }) => {
    return (
        <View
            style={[
                styles.chatItem,
                role === "user" ? styles.userChatItem : styles.modelChatItem,
            ]}
        >
            <Text style={styles.chatText}>{text}</Text>
            {role === "model" && (
                <TouchableOpacity onPress={onSpeech} style={styles.speakerIcon}>
                    <Ionicons name="volume-high-outline" size={24} color="#fff" />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        marginBottom: 10,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 20,
        maxWidth: "85%",
        position: "relative",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    userChatItem: {
        alignSelf: "flex-end",
        backgroundColor: "#0891b2",
        borderTopRightRadius: 0, // Custom corner style for user bubble
    },
    modelChatItem: {
        alignSelf: "flex-start",
        backgroundColor: "#626D77",
        borderTopLeftRadius: 0, // Custom corner style for model bubble
    },
    chatText: {
        fontSize: 16,
        color: "#fff",
    },
    speakerIcon: {
        position: "absolute",
        bottom: 5,
        right: 5,
    }
});

export default ChatBubble;
