import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, TextInput, Modal, Button, Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { supabase } from '../../lib/initSupabase';
import { MaterialIcons } from '@expo/vector-icons';  // Import Material Icons

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

    const toggleGoalCompletion = async (goalId) => {
        const updatedGoal = goals.find(goal => goal.id === goalId);

        if (!updatedGoal) {
            console.error("Goal not found!");
            return;
        }

        console.log("Goal to update:", updatedGoal);

        const { error } = await supabase
            .from('Goals')
            .update({ completed: !updatedGoal.completed })
            .eq('id', goalId);

        if (error) {
            console.error("Error updating goal completion:", error.message);
        } else {
            setGoals(prevGoals => prevGoals.map(goal => 
                goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
            ));
        }
    };

    const handleAddGoal = async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
    
        if (authError || !user) {
            console.error("Error fetching user:", authError?.message);
            return;
        }
    
        const userEmail = user.email;
    
        // Ensure goal data is valid before inserting
        if (!newGoalName || !newGoalDueDate) {
            console.error("Goal name or due date is missing!");
            return;
        }
    
        // Check if due_date is a valid date
        const parsedDueDate = new Date(newGoalDueDate);
        if (isNaN(parsedDueDate.getTime())) {
            console.error("Invalid due date format!");
            return;
        }
    
        const { data, error, status } = await supabase
            .from('Goals')
            .insert([
                {
                    name: newGoalName,
                    due_date: parsedDueDate.toISOString(),  // Ensure proper ISO format
                    urgent: newGoalUrgent,
                    email: userEmail,
                }
            ])
            .select();  // This will explicitly request the inserted row to be returned
    
        // Log both data and error to get more context
        console.log("Insert response:", { data, error, status });
    
        if (error) {
            console.error("Error inserting new goal:", error.message);
        } else {
            console.log("Inserted goal data:", data);
            setGoals(prevGoals => [...prevGoals, ...data]);
            setShowModal(false);
            setNewGoalName('');
            setNewGoalDueDate('');
            setNewGoalUrgent(false);
        }
    
        // Log to make sure data is being passed
        console.log(newGoalName);
        console.log(newGoalDueDate);
        console.log(newGoalUrgent);
    };
    
    

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
                            name={collapsedUrgent ? 'arrow-right' : 'arrow-drop-down'}  // Use Material Icon
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
        paddingTop: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    sectionHeaderText: {
        fontSize: 18,
    },
    goalsContainer: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    goalBox: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },
    checkboxContainer: {
        marginRight: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
    },
    goalTextContainer: {
        flex: 1,
    },
    goalText: {
        fontSize: 16,
    },
    goalDate: {
        fontSize: 14,
        color: 'gray',
    },
    addButton: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        paddingLeft: 10,
    },
    checkboxLabel: {
        fontSize: 16,
        marginRight: 10,
    },
});

export default Goals;
