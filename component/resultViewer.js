import React, { Component } from 'react';
import { StyleSheet, Text, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

class resultViewer extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
            <Text>please wait. this Page is Result</Text>
        );
    }
}

const styles = StyleSheet.create({

});

export default resultViewer;
