import React, { Component } from 'react'
import { StyleSheet, View, StatusBar, Text, Dimensions, AsyncStorage, Button } from 'react-native';
import QuestionViewer from './QuestionViewer';
import ResultViewer from './ResultViewer';

const { height, width } = Dimensions.get("window");

class TopViewer extends Component {
    static navigationOptions = { header: null, bottom: null };

    constructor(props) {
        super(props)

        this.state = {
            questions: null,
            markingSheet: null,
            totalQuestionCnt: 0,
            complete: false,
            updated: false,
        }
    }

    componentDidMount() {
        this.loadToStorage().then((questions) => {
            if (questions === null) {
                this.AsyncTestbook();
            } else {
                this.setTestingState(questions);
            }
        });
    }

    render() {

        return (
                <View style={styles.container}>

                    <StatusBar barStyle="light-content" />

                    <View style={{ flexDirection: "row", marginTop: 45, marginBottom: 15 }}>

                    </View>
                    {(this.state.questions && this.state.updated) ?
                        <View style={styles.card}>
                            {this.state.complete ?
                                <ResultViewer questions={this.state.questions} markingSheet={this.state.markingSheet}></ResultViewer>
                                :
                                <QuestionViewer questions={this.state.questions} markingSheet={this.state.markingSheet} handleMarking={this.handleMarking} confirmMarking={this.confirmMarking} submitTest={this.submitTest}></QuestionViewer>
                            }
                        </View>

                        : <Text>please wait</Text>
                    }
                </View >
        );
    }

    // function

    AsyncTestbook = () => {
        this.getTestbookFromApiAsync(99999999);
    }


    getTestbookFromApiAsync = (testbookId) => {
        fetch('http://192.168.0.2:5000/api/app/testbook/' + testbookId)
            .then(response => {
                response.json().then((data) => {
                    this.setTestingState(data);
                })
            })
            .catch((error) => {
                console.log("fail", error);
            });
    }

    SaveToStorage = (testbook) => {
        AsyncStorage.setItem("testbook", JSON.stringify(testbook));
    }

    loadToStorage = async () => {
        try {
            const questionsAsJson = await AsyncStorage.getItem("testbook");
            return questions = questionsAsJson ? JSON.parse(questionsAsJson) : null;
        } catch (err) {
            console.log(err);
        }
    }

    // 테스트 준비 상태 세팅
    setTestingState = async (questions) => {

        if (questions.length === 0) return;

        let subQuestionNo = 0;
        // 서브퀘스트에 questionNo부여
        const newQuestions = questions.map((question) => {
            const newSubQuestion = question.subQuestions.map((subQuestion) => {
                const newSubQuestion = {
                    ...subQuestion,
                    subQuestionNo: subQuestionNo
                }
                subQuestionNo = subQuestionNo + 1;
                return newSubQuestion;
            });
            const newQuestion = {
                ...question,
                subQuestions: newSubQuestion
            }

            return newQuestion;
        });

        // 서브퀘스트 수만큼 답안시트 작성
        const newMarkingSheet = []
        for (let index = 0; index < subQuestionNo; index++) {
            newMarkingSheet.push(new Set());
        }

        await this.setState({
            ...this.state,
            questions: newQuestions,
            totalQuestionCnt: subQuestionNo,
            markingSheet: newMarkingSheet,
            updated: true
        });
    }

    handleMarking = (selectionType, subQuestionNo, selectionId, answerCnt) => {

        let newMarkingSheet = this.state.markingSheet;

        switch (selectionType) {
            // 답선택수 제한 없음
            case 0: {

                newMarkingSheet[subQuestionNo].has(selectionId) ? newMarkingSheet[subQuestionNo].delete(selectionId) : newMarkingSheet[subQuestionNo].add(selectionId);

                this.setState({
                    ...this.state,
                    markingSheet: newMarkingSheet
                })
                return
            }
            // 1개의 답선택가능
            case 1: {
                if (newMarkingSheet[subQuestionNo].has(selectionId)) {
                    newMarkingSheet[subQuestionNo].clear();
                } else {
                    newMarkingSheet[subQuestionNo].clear();
                    newMarkingSheet[subQuestionNo].add(selectionId);
                }

                this.setState({
                    ...this.state,
                    markingSheet: newMarkingSheet
                })
                return
            }
            // 정답수만큼 답선택가능
            case 2: {
                if (newMarkingSheet[subQuestionNo].has(selectionId)) {
                    newMarkingSheet[subQuestionNo].delete(selectionId)
                } else {
                    if (newMarkingSheet[subQuestionNo].size >= answerCnt) {
                        return
                    }
                    newMarkingSheet[subQuestionNo].add(selectionId);
                }

                this.setState({
                    ...this.state,
                    markingSheet: newMarkingSheet
                })
                return
            }
            default:
                return
        }
    }


    confirmMarking = (subQuestionNo, selectionId) => {
        return this.state.markingSheet[subQuestionNo].has(selectionId);
    }

    submitTest = () => {
        this.setState({
            ...this.state,
            complete: true
        })
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
        flex: 1
    }
});

export default TopViewer;