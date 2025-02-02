import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./components/loginpage";
import Navbar from "./components/navbar";


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
         {/* Log in screen */}
         <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
         {/* Landing Screen */}
        <Stack.Screen name="Navbar Home" component={Navbar} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
