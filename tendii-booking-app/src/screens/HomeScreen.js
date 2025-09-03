import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [recentServices, setRecentServices] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [categoriesData, servicesData, appointmentsData] = await Promise.all([
        apiService.getServiceCategories(),
        apiService.getServices({ page_size: 4 }),
        apiService.getAppointments(),
      ]);

      setCategories(categoriesData.results || categoriesData);
      setRecentServices(servicesData.results || servicesData);
      
      // Filter upcoming appointments
      const upcoming = (appointmentsData.results || appointmentsData)
        .filter(apt => new Date(apt.appointment_date) >= new Date())
        .slice(0, 3);
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.log('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const icons = {
      'Healthcare': 'local-hospital',
      'Beauty': 'face',
      'Fitness': 'fitness-center',
      'Education': 'school',
      'Automotive': 'directions-car',
      'Home Services': 'home-repair-service',
    };
    return icons[categoryName] || 'category';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadHomeData} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {user?.first_name || 'Welcome'}! 👋</Text>
            <Text style={styles.subtitle}>Find your perfect appointment</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => navigation.navigate('Services')}
        >
          <Icon name="search" size={20} color="#999" />
          <Text style={styles.searchPlaceholder}>Search for services...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesRow}>
              {categories.slice(0, 6).map((category, index) => (
                <TouchableOpacity
                  key={category.id || index}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('Services', { category: category.id })}
                >
                  <View style={styles.categoryIcon}>
                    <Icon 
                      name={getCategoryIcon(category.name)} 
                      size={24} 
                      color="#007AFF" 
                    />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Services')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentServices.map((service, index) => (
            <TouchableOpacity
              key={service.id || index}
              style={styles.serviceCard}
              onPress={() => navigation.navigate('ServiceDetail', { serviceId: service.id })}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.providerName}>{service.provider_name}</Text>
                <View style={styles.serviceDetails}>
                  <Text style={styles.servicePrice}>${service.price}</Text>
                  <Text style={styles.serviceDuration}>{service.duration} min</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Appointments')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>

            {upcomingAppointments.map((appointment, index) => (
              <View key={appointment.id || index} style={styles.appointmentCard}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentService}>
                    {appointment.service_details?.name}
                  </Text>
                  <Text style={styles.appointmentProvider}>
                    {appointment.provider_name}
                  </Text>
                  <Text style={styles.appointmentDateTime}>
                    {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                    {appointment.appointment_time}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
                  <Text style={styles.statusText}>{appointment.status}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Services')}
            >
              <Icon name="search" size={24} color="#007AFF" />
              <Text style={styles.actionText}>Browse Services</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Appointments')}
            >
              <Icon name="calendar-today" size={24} color="#007AFF" />
              <Text style={styles.actionText}>My Appointments</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStatusColor = (status) => {
  const colors = {
    pending: '#FFA500',
    confirmed: '#4CAF50',
    completed: '#2196F3',
    cancelled: '#F44336',
  };
  return colors[status] || '#999';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#999',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  categoriesRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginRight: 12,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  appointmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  appointmentProvider: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#666',
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
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    marginHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginTop: 8,
  },
});