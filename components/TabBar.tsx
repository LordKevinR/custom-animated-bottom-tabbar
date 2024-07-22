import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons';
import TabBarButton from './TabBarButton';
import { useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function TabBar({ state, descriptors, navigation } : BottomTabBarProps) {

  const [dimensions, setDimensions] = useState({height: 20, width: 100})

  const buttonWidth = dimensions.width / state.routes.length;

  const onTabBarLayout = (e:LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    })
  }

  const tabPositionX = useSharedValue(0)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: tabPositionX.value}]
    }
  })

  return (
    <View onLayout={onTabBarLayout} style={styles.tabBar}>
      <Animated.View style={[animatedStyle, {
        position: 'absolute',
        backgroundColor: '#723FEB',
        borderRadius: 50,
        marginHorizontal: 12,
        height: dimensions.height - 13,
        width: buttonWidth - 25,
      }]}/>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label : any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {duration: 1000})
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
        <TabBarButton 
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? '#fff' : '#222'}
            label={label}
        />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: 80,
        paddingVertical: 15,
        borderRadius: 35,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 10},
        shadowRadius: 10,
        shadowOpacity: 0.1,
        elevation: 6
    },
    tabBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    }
})