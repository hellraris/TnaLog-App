import React, { Component } from 'react';
import { Modal, TouchableHighlight, StyleSheet, Text, Platform, View, TouchableOpacity, Dimensions, ScrollView, Button } from 'react-native';
import { CheckBox, Divider, ListItem } from 'react-native-elements';


const { width, height } = Dimensions.get("window");

class QuestionViewer extends Component {
    static navigationOptions = { header: null };

    constructor(props) {
        super(props)

        this.state = {
            questions: this.props.questions,
            nowQuestionIdx: 0,
            markingSheet: this.props.markingSheet,
            modalVisible: false,
        }

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { scripts, subQuestions } = this.state.questions[this.state.nowQuestionIdx];

        return (
            <View style={styles.container}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{ flex: 1, padding: 20, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
                            {this.state.markingSheet.map((data, index) => {
                                let color = '';
                                data.size === 0 ? color = 'rgba(233,140,122,1.0)' : color = 'rgba(157,233,155,1.0)';
                                return <ListItem key={index} containerStyle={{ backgroundColor: color, margin: 5 }} title={"Q." + (index + 1)} onPress={() => this.goToQuestion(index)} />
                            })}
                            <TouchableHighlight
                                onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible);
                                }}>
                                <Text>close</Text>
                            </TouchableHighlight>
                        </ScrollView>
                    </View>
                </Modal>
                <ScrollView style={styles.contents}>
                    <View style={styles.contentsMargin}>
                        {scripts ? scripts.map((script, index) => {
                            return (
                                <View style={styles.contentsMargin} key={index}>
                                    <View style={styles.contentsInnerMargin}>
                                        <Text>{script.subtilte}</Text>
                                    </View>
                                    <View style={styles.scriptContents}>
                                        <Text>{script.contents}</Text>
                                    </View>
                                </View>
                            )
                        })
                            : {}}
                    </View>
                    <Divider style={{ backgroundColor: 'grey' }} />
                    <View style={styles.contentsMargin}>
                        {subQuestions ? subQuestions.map((subQuestion, subQuestionIdx) => {
                            return (
                                <View style={styles.contentsMargin} key={subQuestionIdx}>
                                    <View style={styles.contentsInnerMargin}>
                                        <Text>{subQuestion.subtilte}</Text>
                                    </View>
                                    <View>
                                        {subQuestion.selections.map((selection, selectionIdx) => {
                                            return (
                                                <TouchableOpacity
                                                    key={selectionIdx}
                                                    style={styles.selection}
                                                    onPress={() => this.props.handleMarking(subQuestion.selectionType, subQuestion.subQuestionNo, selection.id, subQuestion.answer.length)}
                                                >
                                                    <CheckBox
                                                        style={{ marginBottom: 10 }}
                                                        checked={this.state.markingSheet[subQuestion.subQuestionNo].has(selection.id)}
                                                        onPress={() => this.props.handleMarking(subQuestion.selectionType, subQuestion.subQuestionNo, selection.id, subQuestion.answer.length)}
                                                    />
                                                    <Text style={{ marginTop: 5 }}>{selection.text}</Text>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        })
                            : {}}
                    </View>
                </ScrollView>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => this.setModalVisible(!this.state.modalVisible)} style={styles.controlButton}>
                        <Text>...</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.prevQuestion} style={styles.controlButton}>
                        <Text>prev</Text>
                    </TouchableOpacity>
                    {
                        this.state.nowQuestionIdx === this.props.questions.length - 1 ?
                            <TouchableOpacity onPress={() => this.checkComplteTest()} style={styles.controlButton}>
                                <Text>submit</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={this.nextQuestion} style={styles.controlButton}>
                                <Text>next</Text>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        );
    }

    goToQuestion = (index) => {
        this.setState({
            ...this.state,
            modalVisible: !this.state.modalVisible,
            nowQuestionIdx: index
        })
    }

    checkComplteTest = () => {
        let result = true
        this.state.markingSheet.forEach((data) => {
            if (data.size === 0) {
                result = false;
                return;
            }
        })
        if (result) {
            this.props.submitTest()
        }
    }

    prevQuestion = (event) => {
        event.stopPropagation();
        if (this.state.nowQuestionIdx > 0) {
            let newQuestionIdx = this.state.nowQuestionIdx - 1;
            this.setState({
                ...this.state,
                nowQuestionIdx: newQuestionIdx
            })
        }
    }

    nextQuestion = (event) => {
        event.stopPropagation();
        if (this.state.nowQuestionIdx < this.props.questions.length - 1) {
            let newQuestionIdx = this.state.nowQuestionIdx + 1;
            this.setState({
                ...this.state,
                nowQuestionIdx: newQuestionIdx
            })
        }
    }

    // function End

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    controlButton: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: 'center',
        borderWidth: StyleSheet.hairlineWidth,
        height: height * 0.07
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
    footer: {
        flex: 0.1,
        flexDirection: "row",
    },
    selection: {
        borderWidth: StyleSheet.hairlineWidth,
        height: height * 0.05,
        marginBottom: 3,
        paddingRight: 3,
        paddingLeft: 3,
        flexDirection: "row",
        justifyContent: 'center',
        ...Platform.select({
            elevation: 3
        })
    },
    Text: {
        fontSize: 30,
        textAlignVertical: "center",
    },
    scriptContents: {
        borderWidth: StyleSheet.hairlineWidth,
        padding: 5
    },
    contentsMargin: {
        marginBottom: 8
    },
    contentsInnerMargin: {
        marginBottom: 5
    }
});

export default QuestionViewer;
