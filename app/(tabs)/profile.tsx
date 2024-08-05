import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getAuth, signOut, updatePassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import Modal from 'react-native-modal';

const ProfileScreen = () => {
  const [userName, setUserName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [isFinancialDataModalVisible, setFinancialDataModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [financialAmount, setFinancialAmount] = useState('');
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.displayName || 'User Name');
            setProfileImage(userData.profilePicture || 'https://via.placeholder.com/150');
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setProfileImage(uri);
      if (user) {
        try {
          await updateDoc(doc(db, 'Users', user.uid), { profilePicture: uri });
        } catch (error) {
          console.error('Error updating profile image:', error);
        }
      }
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Logged out', 'You have been logged out successfully.');
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  const handleChangePassword = async () => {
    if (user && newPassword) {
      try {
        await updatePassword(user, newPassword);
        setPasswordModalVisible(false);
        Alert.alert('Success', 'Password updated successfully.');
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
      }
    }
  };

  const handleAddFinancialData = async () => {
    if (user && financialAmount) {
      try {
        const accountDocRef = doc(db, 'Accounts', user.uid);
        const accountDoc = await getDoc(accountDocRef);
        if (accountDoc.exists()) {
          const accountData = accountDoc.data();
          const currentBalance = accountData.balance || 0;
          const updatedBalance = currentBalance + parseFloat(financialAmount);

          console.log('Current Balance:', currentBalance);
          console.log('Adding Amount:', financialAmount);
          console.log('Updated Balance:', updatedBalance);

          await updateDoc(accountDocRef, { balance: updatedBalance });

          // Fetch and log the updated document to verify the change
          const updatedAccountDoc = await getDoc(accountDocRef);
          console.log('Updated Account Data:', updatedAccountDoc.data());

          setFinancialDataModalVisible(false);
          Alert.alert('Success', 'Financial data added successfully.');
        } else {
          console.log('Account document does not exist.');
        }
      } catch (error) {
        Alert.alert('Error', (error as Error).message);
        console.error('Error adding financial data:', error);
      }
    } else {
      Alert.alert('Error', 'Please enter a valid amount.');
    }
  };

  return (
    <View style={[defaultStyles.container, localStyles.container]}>
      <View style={localStyles.profileHeader}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image source={{ uri: profileImage }} style={localStyles.profileImage} />
        </TouchableOpacity>
        <View style={localStyles.profileDetails}>
          <Text style={localStyles.profileName}>{userName}</Text>
          <Text style={localStyles.profileStatus}>Available</Text>
        </View>
      </View>

      <View style={localStyles.section}>
        <TouchableOpacity style={localStyles.item} onPress={() => setPasswordModalVisible(true)}>
          <FontAwesome name="key" size={24} color={Colors.primary} />
          <Text style={localStyles.itemText}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.item} onPress={() => setFinancialDataModalVisible(true)}>
          <FontAwesome name="database" size={24} color={Colors.primary} />
          <Text style={localStyles.itemText}>Add Financial Data</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.item}>
          <MaterialIcons name="chat" size={24} color={Colors.primary} />
          <Text style={localStyles.itemText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.item}>
          <FontAwesome name="book" size={24} color={Colors.primary} />
          <Text style={localStyles.itemText}>Tutorial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={localStyles.item} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color={Colors.primary} />
          <Text style={localStyles.itemText}>Log Out</Text>
        </TouchableOpacity>
      </View>

      {/* Password Change Modal */}
      <Modal isVisible={isPasswordModalVisible}>
        <View style={localStyles.modalContent}>
          <Text style={localStyles.modalTitle}>Change Password</Text>
          <TextInput
            style={localStyles.input}
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity style={localStyles.button} onPress={handleChangePassword}>
            <Text style={localStyles.buttonText}>Change Password</Text>
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.button} onPress={() => setPasswordModalVisible(false)}>
            <Text style={localStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Financial Data Modal */}
      <Modal isVisible={isFinancialDataModalVisible}>
        <View style={localStyles.modalContent}>
          <Text style={localStyles.modalTitle}>Add Financial Data</Text>
          <TextInput
            style={localStyles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={financialAmount}
            onChangeText={setFinancialAmount}
          />
          <TouchableOpacity style={localStyles.button} onPress={handleAddFinancialData}>
            <Text style={localStyles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={localStyles.button} onPress={() => setFinancialDataModalVisible(false)}>
            <Text style={localStyles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 20,
  },
  profileDetails: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileStatus: {
    fontSize: 16,
    color: '#777',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 18,
    marginLeft: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
