import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Goals from "./navigation_pages/goals";
import Profile from "./navigation_pages/profile";
import Wellness from "./navigation_pages/wellness";
import Settings from "./navigation_pages/profile_pages/settings";
import Notifications from "./navigation_pages/profile_pages/notifications";
import WellnessReport from "./navigation_pages/profile_pages/wellness_report";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Profile Stack Navigator for profile-related pages
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={Profile} 
        options={{ headerShown: false }} // Hide header only for Profile
      />
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
        options={{ title: "Settings" }} // Back button will appear
      />
      <Stack.Screen 
        name="Notifications" 
        component={Notifications} 
        options={{ title: "Notifications" }} 
      />
      <Stack.Screen 
        name="WellnessReport" 
        component={WellnessReport} 
        options={{ title: "Wellness Report" }} 
      />
    </Stack.Navigator>
  );
};



// Bottom Tab Navigator for main navigation
const Navbar = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Goals" component={Goals} />
      <Tab.Screen name="Wellness" component={Wellness} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default Navbar;
