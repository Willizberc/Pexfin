import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { useAssets } from 'expo-asset';
import { ResizeMode, Video } from 'expo-av';
import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Page = () => {
  const [assets] = useAssets([require('@/assets/videos/intro2.mp4')]);
  return (
    <View style={styles.container}>
      { assets && (
        <Video source={{ uri: assets[0].uri }} style={styles.video} resizeMode={ResizeMode.COVER} shouldPlay isLooping isMuted rate={0.5} />
      )}

      {/* <View style={{marginTop: 80, padding: 20}}>
        <Text style={styles.header}>Ready to change the way you money</Text>
      </View> */}

      <View style={styles.buttons}>
        <Link href={'(auth)/signUp'} style={[defaultStyles.pillButton, { flex: 1, backgroundColor: Colors.dark}]} asChild>
          <TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 22, fontWeight:'500', textTransform: 'uppercase'}}>Sign Up</Text>
          </TouchableOpacity>
        </Link>
        <Link href={'(auth)/logIn'} style={[defaultStyles.pillButton, { flex: 1, backgroundColor: '#f4f4f4'}]} asChild>
          <TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight:'500', textTransform: 'uppercase'}}>Login</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  video: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  // header: {
  //   fontSize: 32,
  //   fontWeight: '900',
  //   textTransform: 'uppercase',
  //   color: 'white',
  //   textAlign: 'center',
  // },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 60,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default Page;