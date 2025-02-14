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

    useEffect(() => {
        const fetchGoals = async () => {
            setLoading(true);

            // Get the currently logged-in user
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                console.error("Error fetching user:", authError?.message);
                setLoading(false);
                return;
            }

            const userEmail = user.email;

            // Fetch goals where "user" in Goals table matches the logged-in user's email
            const { data: goalsData, error: goalsError } = await supabase
                .from('Goals')
                .select('*')
                .eq('email', userEmail);

            if (goalsError) {
                console.error("Error fetching goals:", goalsError.message);
                setGoals([]);  // Set empty array to prevent null
            } else {
                setGoals(goalsData || []);  // Ensure goalsData is always an array
            }

            setLoading(false);
        };

        fetchGoals();
    }, []);

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