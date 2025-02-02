import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";

import Profile from "./navigation_pages/profile";
import Goals from "./navigation_pages/goals";
import Wellness from "./navigation_pages/wellness";


const BottomTab = createBottomTabNavigator();

export const Navbar = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Goals"
      screenOptions={{
        tabBarStyle: { position: "absolute", backgroundColor: "#136D79" },
       
        tabBarActiveTintColor: "#AAE3BC",
        tabBarInactiveTintColor: "#F5F9F9",
      }}
    >
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name={"user"} size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Goals"
        component={Goals}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name={"book"} size={size} color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Wellness"
        component={Wellness}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Feather name={"heart"} size={size} color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "green",
  },
});

export default Navbar;
