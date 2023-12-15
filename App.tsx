import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeTab from './tabs/home';
import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function DiscoverScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Discover!</Text>
    </View>
  );
}

function ActivityScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Activity!</Text>
    </View>
  );
}

function BookmarksScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bookmarks!</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile!</Text>
    </View>
  );
}

export default function App() {
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = "home";
            } else if (route.name === 'Discover') {
              iconName = "compass";
            } else if (route.name === 'Activity') {
              iconName = "time";
            } else if (route.name === 'Bookmarks') {
              iconName = "bookmark";
            } else if (route.name === 'Profile') {
              iconName = "person-circle";
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarStyle:{borderTopWidth: 0},
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarBackground: () => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', }}/>
          ),
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeTab} />
        <Tab.Screen name="Discover" component={DiscoverScreen} />
        <Tab.Screen name="Activity" component={ActivityScreen} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}