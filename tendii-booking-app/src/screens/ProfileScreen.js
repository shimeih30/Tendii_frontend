import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout },
      ]
    );
  };

  const ProfileOption = ({ icon, title, subtitle, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={styles.optionLeft}>
        <View style={styles.optionIcon}>
          <Icon name={icon} size={24} color="#007AFF" />
        </View>
        <View style={styles.optionContent}>
          <Text style={styles.optionTitle}>{title}</Text>
          {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Icon name="chevron-right" size={20} color="#999" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userType}>
            {user?.user_type === 'client' ? 'Client' : 'Service Provider'}
          </Text>
        </View>

        {/* Profile Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <ProfileOption
            icon="person"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          
          <ProfileOption
            icon="lock"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          
          <ProfileOption
            icon="payment"
            title="Payment Methods"
            subtitle="Manage your payment options"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <ProfileOption
            icon="notifications"
            title="Notifications"
            subtitle="Push notifications for appointments"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E5E5E7', true: '#007AFF' }}
                thumbColor="#fff"
              />
            }
          />
          
          <ProfileOption
            icon="language"
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          
          <ProfileOption
            icon="dark-mode"
            title="Dark Mode"
            subtitle="Switch to dark theme"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <ProfileOption
            icon="help"
            title="Help Center"
            subtitle="Get help and support"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          
          <ProfileOption
            icon="feedback"
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          
          <ProfileOption
            icon="info"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('Tendii', 'Version 1.0.0\nBuilt with React Native')}
          />
        </View>

        <View style={styles.section}>
          <ProfileOption
            icon="logout"
            title="Logout"
            subtitle="Sign out of your account"
            onPress={handleLogout}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ by Tendii Team</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
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
  userSection: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  userType: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});
