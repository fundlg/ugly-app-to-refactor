/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment, Component, useState } from "react";
import axios from "axios";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Text,
  View,
  Modal,
  TouchableOpacity
} from "react-native";

import { createStore, combineReducers } from "redux";
import { connect, Provider } from "react-redux";

function results(state = { list: [], selected: {} }, action) {
  switch (action.type) {
    case "set results": {
      return { ...state, list: [...action.data] };
    }
    case "select": {
      return { ...state, selected: { ...action.data } };
    }
    default:
      return state;
  }
}

function modal(state, action) {
  switch (action.type) {
    case "toggle": {
      return !state;
    }
    default:
      return state;
  }
}

/// remove redux. use component state currently, then forceUpdate, & set value inside this, then setState({value:!value})
let store = createStore(combineReducers({ results, modal }), {});

/// merger in one component, remove modal, use results&&
const Details = connect(state => ({
  selected: state.results.selected,
  visible: state.modal
}))(
  ({ selected, visible }) =>
    console.log("selected", selected) || (
      <Modal visible={visible}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Details</Text>
          <Text>Score : {selected.score}</Text>
          <Text>
            Forks? : {selected.fork && selected.fork ? "true" : "false"}
          </Text>
          <Text>Full Name : {selected.full_name}</Text>
          <TouchableOpacity
            onPress={() => store.dispatch({ type: "toggle" })}
            style={{ paddingTop: 50 }}
          >
            <Text>Hide</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
);

const Body = connect(state => ({ results: state.results.list }))(
  ({ results }) => (
    <Fragment>
      <StatusBar barStyle="dark-content" backgroundColor="lime" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "lime" }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "lime"
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 35
            }}
          >
            Best Git Repo searcher
          </Text>
        </View>
        <Text> Search some repositories</Text>
        <TextInput
          onChangeText={text =>
            axios
              /// add util to switch search entity with ugly signature
              .get(`https://api.github.com/search/repositories?q=${text}`)
              .then(res => {
                console.log({ res });
                store.dispatch({ type: "set results", data: res.data.items });
              })
          }
        />
        <Details />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}
        >
          {results.map(item => (
            <View
              style={{
                backgroundColor: "aquamarine",
                borderBottomColor: "black",
                borderBottomWidth: 1
              }}
            >
              <Text>{item.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  store.dispatch({ type: "toggle" });
                  store.dispatch({ type: "select", data: item });
                }}
              >
                <Text
                  style={{ textDecorationLine: "underline", color: "blue" }}
                >
                  {item.url}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Fragment>
  )
);

const App = () => (
  <Provider store={store}>
    <Body />
  </Provider>
);

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff"
  }
});

export default App;
