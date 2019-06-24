import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';

const { width, height } = Dimensions.get("window");

class ExplanationViewer extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props)

        this.state = {
            question: null
        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                <Text>ExplanationViewer</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contents: {
        padding: 10,
        flex: 0.9,
        backgroundColor: "white",
        width: width - 20,
        height: height - 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },

});

export default ExplanationViewer;
