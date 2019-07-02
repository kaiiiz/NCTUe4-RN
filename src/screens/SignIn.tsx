import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Linking,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import * as Keychain from 'react-native-keychain'
import Button from 'apsl-react-native-button'
import Spinner from 'react-native-spinkit'
import { goAnn } from '../navigation';
import NewE3ApiClient from '../client/NewE3ApiClient'

interface Props { }
interface States {
  showSpinner: boolean,
  failed: boolean,
  failedMsg: string,
  username: string,
  password: string,
}

export default class SignIn extends Component<Props, States> {

  constructor(props: Props) {
    super(props)
    this.state = {
      showSpinner: false,
      failed: false,
      failedMsg: '',
      username: '',
      password: '',
    }
  }

  forgotPass = () => {
    Linking.openURL('https://portal.nctu.edu.tw/portal/forget.php')
  }

  signIn = async () => {
    Keyboard.dismiss() // hide keyboard
    this.setState({ failed: false, showSpinner: true }) // show spinner

    let client = new NewE3ApiClient
    const { username, password } = this.state

    await client.login(username, password)
      .then(() => {
        Keychain.setGenericPassword(username, password)
        goAnn()
      })
      .catch(err => {
        this.setState({ failed: true, failedMsg: err.message, showSpinner: false })
      })
  }

  render() {
    const renderSpinnerOrText = () => {
      if (this.state.showSpinner) {
        return <Spinner size={100} type="Pulse" color="#FFFFFF" />
      }
      return this.state.failed ? this.state.failedMsg : 'LOGIN'
    }

    return (
      // Android may behave better when given no behavior prop at all, whereas iOS is the opposite.
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.inner}>

          <View style={styles.logoContainer}>
            <Image
              style={{ width: 140, height: 140 }}
              source={require('NCTUe4/src/img/ic_fox.png')}
            />
            <Text style={styles.logoTitle}>NCTUe4</Text>
            <Text style={styles.logoSubTitle}>\ Make New E3 great again /</Text>
          </View>

          <View style={styles.inputContainer}>

            <Text style={styles.keychain}>Username</Text>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              onChangeText={username => this.setState({ username: username })}
            />

            <Text style={styles.keychain}>Password</Text>
            <TextInput
              style={styles.textInput}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={password => this.setState({ password: password })}
            />

            <TouchableOpacity onPress={this.forgotPass}>
              <Text style={styles.forgotPass}>Forgot password?</Text>
            </TouchableOpacity>

            <Button
              style={this.state.failed ? styles.buttonFailed : styles.button}
              textStyle={styles.buttonText}
              onPress={this.signIn}
              isDisabled={this.state.showSpinner ? true : false}
            >
              {renderSpinnerOrText()}
            </Button>
            
          </View>
          {/* fill the rest of screen */}
          <View style={{ flex: 1 }} />
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  // logo container
  logoContainer: {
    paddingTop: 90,
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 30,
    fontFamily: 'ArialRoundedMTBold',
    color: '#222222',
    marginTop: 20,
  },
  logoSubTitle: {
    fontWeight: '500',
    fontSize: 18,
    fontFamily: 'ArialRoundedMTBold',
    color: '#777777',
    marginTop: 4,
  },
  // input container
  inputContainer: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 50,
  },
  keychain: {
    fontSize: 14,
    color: '#777777',
    fontWeight: '600',
    fontFamily: 'ArialRoundedMTBold',
  },
  forgotPass: {
    fontSize: 18,
    color: '#999999',
    fontWeight: '400',
    fontFamily: 'ArialRoundedMTBold',
    textAlign: 'right',
    marginBottom: 20,
  },
  textInput: {
    height: 45,
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#CCCCCC',
  },
  button: {
    height: 60,
    backgroundColor: 'rgba(155, 89, 182, 0.8)',
    borderWidth: 0,
    borderRadius: 2,
    marginBottom: 0,
  },
  buttonFailed: {
    height: 60,
    backgroundColor: '#e74c3c',
    borderWidth: 0,
    borderRadius: 2,
    marginBottom: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontFamily: 'ArialRoundedMTBold',
  },
})