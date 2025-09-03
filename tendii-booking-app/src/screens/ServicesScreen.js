import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { apiService } from '../services/api';

export default function ServicesScreen({ navigation, route }) {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(route?.params?.category || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [categoriesData, servicesData] = await Promise.all([
        apiService.getServiceCategories(),
        apiService.getServices({
          category: selectedCategory,
          search: searchQuery,
        }),
      ]);

      setCategories(categoriesData.results || categoriesData);
      setServices(servicesData.results || servicesData);
    } catch (error) {
      console.log('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>${item.price}</Text>
      </View>
      
      <Text style={styles.providerName}>{item.provider_name}</Text>
      <Text style={styles.serviceDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.serviceFooter}>
        <View style={styles.serviceMeta}>
          <Icon name="schedule" size={16} color="#666" />
          <Text style={styles.serviceDuration}>{item.duration} min</Text>
        </View>
        
        {item.category_name && (
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.category_name}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryFilter = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryFilter,
        selectedCategory === item.id && styles.categoryFilterActive
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
    >
      <Text style={[
        styles.categoryFilterText,
        selectedCategory === item.id && styles.categoryFilterTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Services</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="clear" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryFilter}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Services List */}
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.servicesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="search-off" size={48} color="#999" />
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedCategory ? 'No services found' : 'No services available'}
            </Text>
            {(searchQuery || selectedCategory) && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
              >
                <Text style={styles.clearFiltersText}>Clear filters</Text>
              </TouchableOpacity>
            )}
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    backgroundColor: 'white',
  },
  categoryFilterActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: 'white',
  },
  servicesList: {
    padding: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  serviceHeader: {
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
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  providerName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    color: '#007AFF',
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
  },
  clearFiltersButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});