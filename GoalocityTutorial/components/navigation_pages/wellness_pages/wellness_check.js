import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Modal, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../../lib/initSupabase';

const WellnessCheck = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params || {}; // Get email from navigation params
    
    // State for tracking form inputs
    const [energy, setEnergy] = useState('');
    const [selectedEmotions, setSelectedEmotions] = useState([]);
    const [newEmotion, setNewEmotion] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false); // State for showing modal

    // Emotion options, including "Other"
    const [emotionOptions, setEmotionOptions] = useState(['a', 'b', 'c', 'd', 'e']);

    // Function to handle wellness check submission
    const submitWellnessCheck = async () => {
        if (!email || !energy || selectedEmotions.length === 0) {
            console.log("Please fill in all fields");
            return;
        }

        setLoading(true);

        // Combine selected emotions with the custom 'other' emotion if any
        const emotionsString = [...selectedEmotions, newEmotion].filter(Boolean).join(', ');

        // Insert wellness check data into Supabase Wellness table
        const { error } = await supabase
            .from('Wellness')
            .insert([
                {
                    email,
                    energy,
                    emotions: emotionsString,
                }
            ]);

        if (error) {
            console.error("Error submitting wellness check:", error.message);
            setLoading(false);
            return;
        }

        // Increment the wellness check counter for the user
        const { data, error: counterError } = await supabase
            .from('Users')
            .select('wellness_checks')
            .eq('email', email)
            .single();

        if (counterError) {
            console.error("Error fetching wellness check count:", counterError.message);
            setLoading(false);
            return;
        }

        const newCount = data.wellness_checks ? data.wellness_checks + 1 : 1;

        const { error: updateError } = await supabase
            .from('Users')
            .update({ wellness_checks: newCount })
            .eq('email', email);

        if (updateError) {
            console.error("Error updating wellness check count:", updateError.message);
            setLoading(false);
            return;
        }

        setLoading(false);
        navigation.goBack();
    };

    // Handle adding a new emotion from the modal
    const handleAddEmotionFromModal = () => {
        if (newEmotion && !emotionOptions.includes(newEmotion)) {
            setEmotionOptions([...emotionOptions, newEmotion]); // Add new emotion to the list
            setSelectedEmotions([...selectedEmotions, newEmotion]); // Add new emotion to the selected list
            setNewEmotion(''); // Reset the input field
        }
        setIsModalVisible(false); // Close the modal after adding
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Wellness Check</Text>

            {/* Energy Level */}
            <Text style={styles.question}>How is your energy?</Text>
            <View style={styles.buttonGroup}>
                {['Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((level) => (
                    <TouchableOpacity
                        key={level}
                        style={[styles.button, energy === level && styles.selectedButton]}
                        onPress={() => setEnergy(level)}>
                        <Text style={styles.buttonText}>{level}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Emotions */}
            <Text style={styles.question}>What emotions are you feeling?</Text>
            <View style={styles.buttonGroup}>
                {emotionOptions.map((emotion) => (
                    <TouchableOpacity
                        key={emotion}
                        style={[styles.button, selectedEmotions.includes(emotion) && styles.selectedButton]}
                        onPress={() => {
                            if (selectedEmotions.includes(emotion)) {
                                setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
                            } else {
                                setSelectedEmotions([...selectedEmotions, emotion]);
                            }
                        }}>
                        <Text style={styles.buttonText}>{emotion}</Text>
                    </TouchableOpacity>
                ))}

                {/* "Other" Option */}
                <TouchableOpacity
                    style={[styles.button]}
                    onPress={() => setIsModalVisible(true)}> {/* Show modal on press */}
                    <Text style={styles.buttonText}>Other</Text>
                </TouchableOpacity>
            </View>

            {/* Submit Button */}
            {loading ? (
                <ActivityIndicator size="large" color="#3498db" />
            ) : (
                <TouchableOpacity style={styles.submitButton} onPress={submitWellnessCheck}>
                    <Text style={styles.submitButtonText}>Complete Wellness Check</Text>
                </TouchableOpacity>
            )}

            {/* Modal for "Other" Emotion */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Please type your emotion</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Type your emotion"
                            value={newEmotion}
                            onChangeText={setNewEmotion}
                        />
                        <View style={styles.modalButtonGroup}>
                            <Button title="Add Emotion" onPress={handleAddEmotionFromModal} />
                            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
    question: {
        fontSize: 18,
        marginVertical: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 8,
        margin: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    selectedButton: {
        backgroundColor: '#2980b9',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '80%',
        marginVertical: 10,
    },
    submitButton: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10,
    },
    modalButtonGroup: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});

export default WellnessCheck;
