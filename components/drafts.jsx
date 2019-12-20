

const AppNavigator = createStackNavigator(
  {
    Auth: Auth,
    Loading: Loading,
    Locatione: Locatione,
    Map: Map,
    Contactos: Contactos
  },
  {
    initialRouteName: "Loading"
  }
);

const TabNavigator = createBottomTabNavigator(
  {
    Profile: { screen: Profile },
    Main: { screen: AppNavigator },
    History: { screen: History }
  },
  {
    initialRouteName: "Main"
  }
);

export default function App() {
  return <AppContainer />;
}

const AppContainer = createAppContainer(TabNavigator);

// this can stay commented
// const AppContainer = createAppContainer(AppNavigator);
// export default createAppContainer(TabNavigator);
