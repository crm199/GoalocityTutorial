import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, TextInput, Modal, Button, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { supabase } from '../../lib/initSupabase';
import { MaterialIcons } from '@expo/vector-icons';  // Import Material Icons

//import React from 'react';
//import { View, Text, StyleSheet } from 'react-native';

const Goals = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Goals</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
    },
});

export default Goals;