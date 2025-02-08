import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Goals from "./navigation_pages/goals";
import Profile from "./navigation_pages/profile";
import Wellness from "./navigation_pages/wellness";
import Settings from "./navigation_pages/profile_pages/settings";
import Notifications from "./navigation_pages/profile_pages/notifications";
import WellnessReport from "./navigation_pages/profile_pages/wellness_report";
import WellnessCheck from "./navigation_pages/wellness_pages/wellness_check";
import { Feather } from "@expo/vector-icons";

// Define stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator(); // Correct variable usage

// Profile Stack Navigator
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={Settings} options={{ title: "Settings" }} />
      <Stack.Screen name="Notifications" component={Notifications} options={{ title: "Notifications" }} />
      <Stack.Screen name="WellnessReport" component={WellnessReport} options={{ title: "Wellness Report" }} />
    </Stack.Navigator>
  );
};

// Wellness Stack Navigator
const WellnessStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WellnessMain" component={Wellness} options={{ headerShown: false }} />
      <Stack.Screen name="WellnessCheck" component={WellnessCheck} options={{ title: "Wellness Check" }} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
export const Navbar = () => {
  return (
    <Tab.Navigator
      initialRouteName="Goals"
      screenOptions={{
        tabBarStyle: { position: "absolute", backgroundColor: "#136D79" },
        tabBarActiveTintColor: "#AAE3BC",
        tabBarInactiveTintColor: "#F5F9F9",
      }}
    >
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name={"user"} size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Goals"
        component={Goals}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name={"book"} size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Wellness"
        component={WellnessStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Feather name={"heart"} size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Navbar;
