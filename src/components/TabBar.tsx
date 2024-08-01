import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * Renders the tab bar component.
 * @param {object} props - The component props.
 * @param {object} props.state - The state object containing the current route information.
 * @param {object} props.descriptors - The descriptors object containing the configuration for each route.
 * @param {object} props.navigation - The navigation object for navigating between routes.
 * @returns {JSX.Element} The rendered tab bar component.
 */
const TabBar = ({ state, descriptors, navigation }) => {

  const icons: { [key: string]: (props: any) => JSX.Element } = {
    home: (props: any) => <AntDesign name="home" size={26} color={greyColor} {...props} />,
    addTransactions: (props: any) => <AntDesign name="pluscircleo" size={26} color={greyColor} {...props} />,
    budget: (props: any) => <FontAwesome name="bar-chart" size={26} color={greyColor} {...props} />,
    profile: (props: any) => <AntDesign name="user" size={26} color={greyColor} {...props} />,
  }

  const primaryColor = '#0891b2';
  const greyColor = '#737373';

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route: {
          key: any;
          params(name: string, params: any): unknown;name: string
}, home: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['_sitemap', '+not-found'].includes(route.name)) return null;

        const isFocused = state.index === home;

        /**
         * Handles the press event for a tab.
         */
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        /**
         * Handles the long press event for a tab.
         */
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            style={styles.tabbarItem}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            {
              icons[route.name]({
                color: isFocused ? primaryColor : greyColor
              })
            }
            <Text style={{
              color: isFocused ? primaryColor : greyColor,
              fontSize: 12,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create ({
    tabbar: {
        position: 'absolute',
        bottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.1
    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    }
})

export default TabBar;