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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <Text style={styles.header}>Goals</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView style={styles.scrollContainer}>
                    {/* Urgent Goals Section */}
                    <TouchableOpacity onPress={() => setCollapsedUrgent(!collapsedUrgent)} style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Urgent</Text>
                        <MaterialIcons 
                            name={collapsedUrgent ? 'arrow-right' : 'arrow-drop-down'} 
                            size={24} 
                            color="black" 
                        />
                    </TouchableOpacity>
                    {!collapsedUrgent && (
                        <View style={styles.goalsContainer}>
                            {goals?.filter(goal => goal.urgent).map((goal) => (
                                <View key={goal.id} style={styles.goalBox}>
                                    <TouchableOpacity onPress={() => toggleGoalCompletion(goal.id)} style={styles.checkboxContainer}>
                                        <Image
                                            source={goal.completed ? require('../../assets/checkbox_checked.png') : require('../../assets/checkbox_unchecked.png')}
                                            style={styles.checkbox}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.goalTextContainer}>
                                        <Text style={styles.goalText}>{goal.name}</Text>
                                        <Text style={styles.goalDate}>Due: {goal.due_date}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Other Goals Section */}
                    <TouchableOpacity onPress={() => setCollapsedOther(!collapsedOther)} style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>Other</Text>
                        <MaterialIcons 
                            name={collapsedOther ? 'arrow-right' : 'arrow-drop-down'}  // Use Material Icon
                            size={24} 
                            color="black" 
                        />
                    </TouchableOpacity>
                    {!collapsedOther && (
                        <View style={styles.goalsContainer}>
                            {goals?.filter(goal => !goal.urgent).map((goal) => (
                                <View key={goal.id} style={styles.goalBox}>
                                    <TouchableOpacity onPress={() => toggleGoalCompletion(goal.id)} style={styles.checkboxContainer}>
                                        <Image
                                            source={goal.completed ? require('../../assets/checkbox_checked.png') : require('../../assets/checkbox_unchecked.png')}
                                            style={styles.checkbox}
                                        />
                                    </TouchableOpacity>
                                    <View style={styles.goalTextContainer}>
                                        <Text style={styles.goalText}>{goal.name}</Text>
                                        <Text style={styles.goalDate}>Due: {goal.due_date}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}
                </ScrollView>
            )}

            {/* Add Goal Button */}
            <TouchableOpacity 
                style={styles.addButton} 
                onPress={() => setShowModal(true)}
            >
                <MaterialIcons name="add" size={40} color="white" />
            </TouchableOpacity>

            {/* Modal for Adding New Goal */}
            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowModal(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add New Goal</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Goal Name"
                                value={newGoalName}
                                onChangeText={setNewGoalName}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Due Date (YYYY-MM-DD)"
                                value={newGoalDueDate}
                                onChangeText={setNewGoalDueDate}
                            />

                            <View style={styles.checkboxContainer}>
                                <Text style={styles.checkboxLabel}>Urgent</Text>
                                <TouchableOpacity onPress={() => setNewGoalUrgent(!newGoalUrgent)}>
                                    <Image
                                        source={newGoalUrgent ? require('../../assets/checkbox_checked.png') : require('../../assets/checkbox_unchecked.png')}
                                        style={styles.checkbox}
                                    />
                                </TouchableOpacity>
                            </View>

                            <Button title="Add Goal" onPress={handleAddGoal} />
                            <Button title="Cancel" onPress={() => setShowModal(false)} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </KeyboardAvoidingView>
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