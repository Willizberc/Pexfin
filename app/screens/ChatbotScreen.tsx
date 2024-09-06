import { View, Text,StyleSheet } from "react-native";
import Chatbot from "@/src/components/Chatbot";

export default function ChatbotScreen() {
    return (
        <View style={styles.container}>
            <Chatbot />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
        // justifyContent: "center",
        // alignItems: "center",
        
    },
});
