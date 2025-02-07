import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/initSupabase';

const Profile = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [completedGoals, setCompletedGoals] = useState(0);
    const [incompleteGoals, setIncompleteGoals] = useState(0);

    // Function to fetch user data and goals
    const fetchUserData = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error("Error fetching user:", error?.message);
            return;
        }
        setEmail(user.email);

        // Fetch goals for this user
        const { data: goals, error: goalsError } = await supabase
            .from('Goals')
            .select('completed')
            .eq('email', user.email);

        if (goalsError) {
            console.error("Error fetching goals:", goalsError.message);
            return;
        }

        // Count completed and incomplete goals
        const completedCount = goals.filter(goal => goal.completed).length;
        const incompleteCount = goals.length - completedCount;

        setCompletedGoals(completedCount);
        setIncompleteGoals(incompleteCount);
    };

    // Re-fetch data whenever the Profile screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
        }, []) // Empty dependency means it runs every time Profile is focused
    );

    return (
        <View style={styles.container}>
            <Text style={styles.email}>{email}</Text>

            {/* Goals Overview */}
            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{completedGoals}</Text>
                    <Text style={styles.statLabel}>Completed Goals</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statNumber}>{incompleteGoals}</Text>
                    <Text style={styles.statLabel}>Incomplete Goals</Text>
                </View>
            </View>

            {/* Navigation Buttons */}
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Settings')}>
                <Text style={styles.buttonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('Notifications')}>
                <Text style={styles.buttonText}>Notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('WellnessReport')}>
                <Text style={styles.buttonText}>Wellness Report</Text>
            </TouchableOpacity>
        </View>
    );
};

// **Styles**
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    email: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    statBox: {
        backgroundColor: '#f0f0f0',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '45%',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        fontSize: 14,
        color: 'gray',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginVertical: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Profile;
