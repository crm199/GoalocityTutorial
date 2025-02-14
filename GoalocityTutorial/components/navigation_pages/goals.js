import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, TextInput, Modal, Button, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { supabase } from '../../lib/initSupabase';
import { MaterialIcons } from '@expo/vector-icons';  // Import Material Icons

//import React from 'react';
//import { View, Text, StyleSheet } from 'react-native';

const Goals = () => {
    const [goals, setGoals] = useState([]); // Default to an empty array
    const [loading, setLoading] = useState(true);
    const [collapsedUrgent, setCollapsedUrgent] = useState(false);
    const [collapsedOther, setCollapsedOther] = useState(false);
    const [showModal, setShowModal] = useState(false);  // For showing the form modal
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalDueDate, setNewGoalDueDate] = useState('');
    const [newGoalUrgent, setNewGoalUrgent] = useState(false);

}



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