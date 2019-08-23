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

const search = (searchBy, text) => {
  const URL = "https://api.github.com/search";
  if (byRepo) {
    return axios.get(`${URL}/${searchBy}?q=${text}`);
  }
  if (byUser) {
    return axios.get(`${URL}/users?q=${text}`);
  }
  if (byIssues) {
    return axios.get(`${URL}/issues?q=${text}`);
  }
};

class App extends React.Component {
  state = {};

  onChangeText = text => {
    const { searchBy } = this.state;
    return search(searchBy, text)
      .then(res => {
        this.setState({ results: res.data.items });
        // this.forceUpdate();
      })
      .catch(err => console.log({ err }));
  };

  onPickerValueChange = itemValue => {
    this.setState({ searchBy: itemValue });
    this.forceUpdate();
  };

  onButtonPress = () => {
    delete this.state.selected;
    this.setState({ changed: !this.state.changed });
  };

  render() {
    const { results, selected, searchBy } = this.state;
    console.log(results);

    return React.cloneElement(
      <Fragment>
        <StatusBar barStyle="dark-content" backgroundColor="lime" />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.view}>
            <Text style={styles.title}>Best Git Repo searcher</Text>
          </View>
          <Text> Search some repositories</Text>
          <TextInput
            style={styles.repositoriesInput}
            onChangeText={this.onChangeText}
          />
          <Picker
            selectedValue={searchBy || "repositories"}
            style={styles.picker}
            onValueChange={this.onPickerValueChange}
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
            <View style={styles.infoBlock}>
              <Text>Details</Text>
              <Text>Score : {selected.score}</Text>
              <Text>
                Forks? : {selected.fork && selected.fork ? "true" : "false"}
              </Text>
              <Text>Full Name : {selected.full_name}</Text>
              <TouchableOpacity
                onPress={this.onButtonPress}
                style={styles.button}
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
                <View style={styles.result}>
                  <Text>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.setState({ selected: item });
                      this.forceUpdate();
                    }}
                  >
                    <Text style={styles.itemUrl}>{item.url}</Text>
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
  },
  itemUrl: {
    textDecorationLine: "underline",
    color: "blue"
  },
  result: {
    backgroundColor: "aquamarine",
    borderBottomColor: "black",
    borderBottomWidth: 1
  },
  safeArea: {
    flex: 1,
    backgroundColor: "lime"
  },
  view: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lime"
  },
  picker: {
    height: 150,
    width: 100
  },
  title: {
    fontWeight: "bold",
    fontSize: 35
  },
  button: {
    paddingTop: 50
  },
  input: {
    borderColor: "black",
    borderWidth: 1
  },
  repositoriesInput: {
    borderColor: "black",
    borderWidth: 1
  },
  infoBlock: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default App;
