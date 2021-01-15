import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import Pagos from '../screens/Pagos';
import Perfil from '../screens/Perfil';
import Agenda1 from '../screens/Agenda';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
        }}
      />
      <BottomTab.Screen
      name="profile"
      component={Perfil}
      options={{
        title: 'Pacientes',
        tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
      }}
    />
    
    
      <BottomTab.Screen
        name="Links"
        component={Pagos}
        options={{
          title: 'Agenda',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
      <BottomTab.Screen
    name="configuracion"
    component={LinksScreen}
    options={{
      title: 'Config',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-build" />,
    }}
  />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'Inicio';
    case 'Links':
      return 'Agenda';
    case 'configuracion':
      return 'Configuración';
    case 'profile':
      return 'Pacientes';
   
  }
}
