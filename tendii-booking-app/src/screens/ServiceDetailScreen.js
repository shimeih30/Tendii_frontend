import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/api';

export default function ServiceDetailScreen({ navigation, route }) {
  const { serviceId } = route.params;
  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);
  const [businessHours, setBusinessHours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const loadServiceDetails = async () => {
    try {
      const serviceData = await apiService.getService(serviceId);
      setService(serviceData);
      
      if (serviceData.provider) {
        const hoursData = await apiService.getBusinessHours(serviceData.provider);
        setBusinessHours(hoursData);
      }
    } catch (error) {
      console.log('Error loading service details:', error);
      Alert.alert('Error', 'Failed to load service details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (service) {
      navigation.navigate('Booking', { 
        serviceId: service.id,
        service: service 
      });
    }
  };

  const getDayName = (dayNumber) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!service) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Service not found</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>Service Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Service Info */}
        <View style={styles.serviceSection}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.providerName}>{service.provider_name}</Text>
          
          <View style={styles.serviceDetails}>
            <View style={styles.detailItem}>
              <Icon name="attach-money" size={20} color="#007AFF" />
              <Text style={styles.detailText}>${service.price}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Icon name="schedule" size={20} color="#007AFF" />
              <Text style={styles.detailText}>{service.duration} minutes</Text>
            </View>{service.category_name && (
              <View style={styles.detailItem}>
                <Icon name="category" size={20} color="#007AFF" />
                <Text style={styles.detailText}>{service.category_name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{service.description}</Text>
        </View>

        {/* Business Hours */}
        {businessHours.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Hours</Text>
            {businessHours.map((hour, index) => (
              <View key={index} style={styles.hourItem}>
                <Text style={styles.dayText}>{getDayName(hour.day_of_week)}</Text>
                <Text style={styles.timeText}>
                  {hour.is_closed ? 'Closed' : `${hour.opening_time} - ${hour.closing_time}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Provider Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the Provider</Text>
          <Text style={styles.providerDescription}>
            Professional service provider committed to delivering high-quality services.
          </Text>
        </View>
      </ScrollView>

      {/* Book Now Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookNow}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  providerName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    fontWeight: '500',
  },
  serviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
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
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  hourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  providerDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
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
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});