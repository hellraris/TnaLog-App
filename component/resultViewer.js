import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import { ListItem } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

const { width, height } = Dimensions.get("window");

class ResultViewer extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props)

        this.state = {
            results: null
        }
    }

    componentDidMount() {
        this.setResult();
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.results ?
                    <ScrollView style={styles.contents}>
                        {this.state.results.map((result, index) => {
                            return <ListItem
                                key={index}
                                containerStyle={result.isAnswer ? 'green' : 'red'}
                                title={"Q." + (result.questionNo + 1)}
                                subtitle={"Answer: " + result.answer + "  YourMarking: " + result.marking}
                                onPress={()=> {this.props.navigation.navigate("ExplanationViewer", {question :this.props.questions[index]})}}
                            />
                        })}
                    </ScrollView>
                    : <Text>please wait</Text>
                }
            </View>
        );
    }

    setResult = () => {

        const results = [];

        this.props.questions.forEach((question) => {
            question.subQuestions.forEach((subQuestion) => {
                let isAnswer = true;
                if (this.props.markingSheet[subQuestion.subQuestionNo].size === subQuestion.answer.length) {
                    this.props.markingSheet[subQuestion.subQuestionNo].forEach((value) => {
                        if (!subQuestion.answer.includes(value)) {
                            isAnswer = false;
                        }
                    })
                } else {
                    isAnswer = false;
                }


                const answerIdx = [];
                const markingIdx = [];

                subQuestion.selections.forEach((selection, index) => {
                    subQuestion.answer.forEach((answer) => {
                        if (selection.id === answer) answerIdx.push(index + 1)
                    });

                    this.props.markingSheet[subQuestion.subQuestionNo].forEach((marking) => {
                        if (selection.id === marking) markingIdx.push(index + 1)
                    });
                })


                results.push({ questionNo: subQuestion.subQuestionNo, answer: answerIdx.sort(), marking: markingIdx.sort(), isAnswer: isAnswer })
            })
        })
        this.setState({
            ...this.state,
            results: results
        })
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

export default withNavigation(ResultViewer);
