import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/api';

export default function BookingScreen({ navigation, route }) {
  const { serviceId, service } = route.params;
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate]);

  const loadAvailableSlots = () => {
    // Generate sample time slots (in a real app, this would come from the API)
    const slots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
    ];
    setAvailableSlots(slots);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    setSelectedTime(''); // Reset time selection
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        service: serviceId,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes: notes.trim(),
      };

      await apiService.createAppointment(appointmentData);
      
      Alert.alert(
        'Success',
        'Your appointment has been booked successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Appointments'),
          },
        ]
      );
    } catch (error) {
      console.log('Booking error:', error);
      Alert.alert(
        'Booking Failed',
        error.response?.data?.message || 'Failed to book appointment. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Service Summary */}
        <View style={styles.serviceSection}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.providerName}>{service.provider_name}</Text>
          <View style={styles.serviceMeta}>
            <Text style={styles.servicePrice}>${service.price}</Text>
            <Text style={styles.serviceDuration}>{service.duration} min</Text>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <Calendar
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#007AFF',
              },
            }}
            minDate={today}
            theme={{
              selectedDayBackgroundColor: '#007AFF',
              todayTextColor: '#007AFF',
              arrowColor: '#007AFF',
            }}
          />
        </View>

        {/* Time Selection */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Times</Text>
            <View style={styles.timeSlots}>
              {availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.timeSlot,
                    selectedTime === slot && styles.selectedTimeSlot,
                  ]}
                  onPress={() => handleTimeSelect(slot)}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTime === slot && styles.selectedTimeSlotText,
                    ]}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or notes..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Booking Summary */}
        {selectedDate && selectedTime && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{service.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Provider:</Text>
              <Text style={styles.summaryValue}>{service.provider_name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{selectedTime}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{service.duration} minutes</Text>
            </View>
            <View style={[styles.summaryItem, styles.totalItem]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${service.price}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Book Button */}
      {selectedDate && selectedTime && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.bookButton, loading && styles.buttonDisabled]}
            onPress={handleBookAppointment}
            disabled={loading}
          >
            <Text style={styles.bookButtonText}>
              {loading ? 'Booking...' : 'Confirm Booking'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  serviceSection: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  serviceName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 16,
  },
  serviceDuration: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  timeSlots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    backgroundColor: 'white',
  },
  selectedTimeSlot: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    backgroundColor: '#F8F9FA',
  },
  summarySection: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  totalItem: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
  bookButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
