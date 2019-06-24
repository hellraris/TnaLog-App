import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import TopViewer from './component/TopViewer';
import BookList from './component/BookList';
import ExplanationViewer from './component/ExplanationViewer';
import { Icon } from 'react-native-elements';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';


export default class App extends Component {

  render() {
    return (
      <AppContainer style={styles.container} />
    );
  }

}
// function

const Test = {
  screen: TopViewer,
  naviagtionOptions: {
    tabBarVisible: false
  }
}


const BookStack = createStackNavigator({
  BookList,
  Test,
  ExplanationViewer
},
  {
    navigationOptions: {
      tabBarIcon: <Icon name="book" />
    }
  }
);

BookStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarIcon: <Icon name="book" />,
    tabBarVisible,
  };
};


const BottomNavigator = createBottomTabNavigator({
  BOOK: BookStack
});



const RootStack = createStackNavigator(
  {
    BOTTOM: BottomNavigator
  },
  {
    headerMode: 'none',
    initialRouteName: 'BOTTOM'
  }
);

const AppContainer = createAppContainer(RootStack);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
