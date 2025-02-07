import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/initSupabase';

const Wellness = () => {
    const navigation = useNavigation();
    const [wellnessChecks, setWellnessChecks] = useState(0);
    const [email, setEmail] = useState('');

    // Function to fetch user's wellness check count
    const fetchWellnessChecks = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
            console.error("Error fetching user:", error?.message);
            return;
        }
        setEmail(user.email);

        // Fetch wellness check count
        const { data, error: userError } = await supabase
            .from('Users')
            .select('wellness_checks')
            .eq('email', user.email)
            .single();

        if (userError) {
            console.error("Error fetching wellness checks:", userError.message);
            return;
        }

        setWellnessChecks(data?.wellness_checks || 0);
    };

    // Refresh wellness check count when screen is focused
    useFocusEffect(
        useCallback(() => {
            fetchWellnessChecks();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Wellness</Text>

            {/* Wellness Check Counter */}
            <Text style={styles.counter}>Wellness Checks Completed: {wellnessChecks}</Text>

            {/* Start Wellness Check Button */}
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigation.navigate('WellnessCheck', { email })}
            >
                <Text style={styles.buttonText}>Start Wellness Check</Text>
            </TouchableOpacity>
        </View>
    );
};

// **Styles**
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    counter: {
        fontSize: 18,
        marginBottom: 20,
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

export default Wellness;
