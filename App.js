/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Fragment } from "react";
import axios from "axios";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  Text,
  View,
  Picker,
  TouchableOpacity
} from "react-native";

const search = (byRepo, byUser, byIssues, text) => {
  if (byRepo) {
    return axios.get(`https://api.github.com/search/repositories?q=${text}`);
  }
  if (byUser) {
    return axios.get(`https://api.github.com/search/users?q=${text}`);
  }
  if (byIssues) {
    return axios.get(`https://api.github.com/search/issues?q=${text}`);
  }
};

class App extends React.Component {
  state = {};
  render() {
    const { results, selected } = this.state;
    return React.cloneElement(
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
            style={{ borderColor: "black", borderWidth: 1 }}
            onChangeText={text =>
              search(
                this.state.searchBy == "repositories",
                this.state.searchBy == "users",
                this.state.searchBy == "issues",
                text
              )
                .then(res => {
                  console.log({ res });
                  this.state.results = res.data.items;
                  this.forceUpdate();
                })
                .catch(err => console.log({ err }))
            }
          />
          {console.log("state", this.state)}
          <Picker
            selectedValue={this.state.searchBy || "repositories"}
            style={{
              height: 150,
              width: 100
            }}
            onValueChange={itemValue => {
              this.state.searchBy = itemValue;
              this.forceUpdate();
            }}
          >
            <Picker.Item
              color="black"
              label="repositories"
              value="repositories"
            />
            <Picker.Item color="black" label="users" value="users" />
            <Picker.Item color="black" label="issues" value="issues" />
          </Picker>
          {Object.keys(selected || {}).length > 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Text>Details</Text>
              <Text>Score : {selected.score}</Text>
              <Text>
                Forks? : {selected.fork && selected.fork ? "true" : "false"}
              </Text>
              <Text>Full Name : {selected.full_name}</Text>
              <TouchableOpacity
                onPress={() => {
                  delete this.state.selected;
                  this.setState({ changed: !this.state.changed });
                }}
                style={{ paddingTop: 50 }}
              >
                <Text>Hide</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
            >
              {(results || []).map(item => (
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
                      this.state.selected = item;
                      this.forceUpdate();
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
          )}
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#fff"
  }
});

export default App;
