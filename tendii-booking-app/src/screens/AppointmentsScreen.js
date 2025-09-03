import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/api';

export default function AppointmentsScreen({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all'); // all, upcoming, past

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await apiService.getAppointments();
      setAppointments(data.results || data);
    } catch (error) {
      console.log('Error loading appointments:', error);
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const handleCancelAppointment = (appointmentId) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => cancelAppointment(appointmentId) },
      ]
    );
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      await apiService.cancelAppointment(appointmentId);
      Alert.alert('Success', 'Appointment cancelled successfully');
      loadAppointments(); // Reload the list
    } catch (error) {
      console.log('Error cancelling appointment:', error);
      Alert.alert('Error', 'Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4CAF50',
      completed: '#2196F3',
      cancelled: '#F44336',
      no_show: '#9E9E9E',
    };
    return colors[status] || '#999';
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    switch (filter) {
      case 'upcoming':
        return appointments.filter(apt => 
          apt.appointment_date >= today && 
          apt.status !== 'cancelled' && 
          apt.status !== 'completed'
        );
      case 'past':
        return appointments.filter(apt => 
          apt.appointment_date < today || 
          apt.status === 'completed' ||
          apt.status === 'cancelled'
        );
      default:
        return appointments;
    }
  };

  const renderAppointmentItem = ({ item }) => {
    const isUpcoming = new Date(item.appointment_date) >= new Date() && 
                      item.status !== 'cancelled' && 
                      item.status !== 'completed';
    
    return (
      <View style={styles.appointmentCard}>
        <View style={styles.appointmentHeader}>
          <Text style={styles.serviceName}>{item.service_details?.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        
        <Text style={styles.providerName}>{item.provider_name}</Text>
        
        <View style={styles.appointmentDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar-today" size={16} color="#666" />
            <Text style={styles.detailText}>
              {new Date(item.appointment_date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="schedule" size={16} color="#666" />
            <Text style={styles.detailText}>{item.appointment_time}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="attach-money" size={16} color="#666" />
            <Text style={styles.detailText}>${item.service_details?.price}</Text>
          </View>
        </View>
        
        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Notes:</Text>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
        
        {isUpcoming && item.status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(item.id)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {item.status === 'completed' && !item.review && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate('Review', { appointmentId: item.id })}
            >
              <Text style={styles.reviewButtonText}>Write Review</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.activeFilterTabText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.activeFilterTab]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterTabText, filter === 'upcoming' && styles.activeFilterTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'past' && styles.activeFilterTab]}
          onPress={() => setFilter('past')}
        >
          <Text style={[styles.filterTabText, filter === 'past' && styles.activeFilterTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.appointmentsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="event-busy" size={48} color="#999" />
            <Text style={styles.emptyStateText}>
              {filter === 'upcoming' 
                ? 'No upcoming appointments' 
                : filter === 'past' 
                ? 'No past appointments'
                : 'No appointments found'
              }
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.navigate('Services')}
            >
              <Text style={styles.browseButtonText}>Browse Services</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#007AFF',
  },
  filterTabText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  appointmentsList: {
    padding: 20,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  providerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '500',
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  notesSection: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  browseButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
