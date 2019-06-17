import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import TopViewer from './component/topViewer';
import {
  createStackNavigator,
  createAppContainer
} from 'react-navigation';


export default class App extends Component {

  render() {
    return (
      <AppContainer style={styles.container}/>
    );
  }

}
  // function


const TestStack = createStackNavigator(
    {
      TopViewer
    },
    {
      initialRouteName: 'TopViewer'
    }
  );

const RootStack = createStackNavigator(
  {
    TEST: TestStack
  },
  {
    headerMode: 'none',
    initialRouteName: 'TEST'
  }
);

const AppContainer = createAppContainer(RootStack);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
