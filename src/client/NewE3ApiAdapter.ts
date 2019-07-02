import * as KeyChain from 'react-native-keychain'
import NewE3ApiClient from './NewE3ApiClient';
import AsyncStorage from '@react-native-community/async-storage';

export function token_refresher() {
    let client = new NewE3ApiClient
    
}

export function clean_datas() {
    KeyChain.resetGenericPassword()
    KeyChain.resetInternetCredentials("NewE3")
    AsyncStorage.clear()
}