import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, Text, Dimensions, AsyncStorage, Button } from 'react-native';
import { ListItem } from 'react-native-elements';


const { height, width } = Dimensions.get("window");

class BookList extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props)

        this.state = {
            bookList: null
        }
    }

    componentDidMount() {
        this.getBookListFromApi();
    }

    render() {
        const { bookList } = this.state;

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <View style={{ flexDirection: "row", marginTop: 45, marginBottom: 15 }}>
                </View>
                <View style={styles.card}>
                    {bookList ?
                        bookList.map((book, index) => {
                            return <ListItem key={index} title={book.title} onPress={() => this.props.navigation.navigate("Test", book.testbook_id)}/>
                        })
                        :
                        <Text>Please wait</Text>
                    }
                </View>
            </View>
        );
    }


    // function

    getBookListFromApi = () => {
        fetch('http://192.168.0.2:5000/api/app/testbook/list')
            .then(response => {
                response.json().then((data) => {
                    this.setState({
                        bookList: data
                    })
                })
            })
            .catch((error) => {
                console.log("fail", error);
            })
    }

    selectBook = () => {

    }

    // function End
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "steelblue",
        alignItems: "center"
    },
    card: {
        flex: 1,
        padding: 10,
        flex: 0.9,
        backgroundColor: "white",
        width: width - 20,
        height: height - 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    }
});

export default BookList;