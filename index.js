/**
 * @format
 */

import { Navigation } from "react-native-navigation";
import { registerScreens } from './src/screens';
import { goAnn } from "./src/navigation";

registerScreens();

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        id: 'Init',
        name: 'Init',
      },
    },
  })
});