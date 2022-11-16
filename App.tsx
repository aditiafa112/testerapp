import React, {useEffect} from 'react';
import {Platform, SafeAreaView, ScrollView, Text, View} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {Header} from 'react-native/Libraries/NewAppScreen';
import SpInAppUpdates, {
  IAUUpdateKind,
  NeedsUpdateResponse,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

import codePush from "react-native-code-push";

const codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_START };

const App = () => {
  const inAppUpdates = new SpInAppUpdates(false);

  useEffect(() => {
    inAppUpdates.checkNeedsUpdate().then((result: NeedsUpdateResponse) => {
      if (result.shouldUpdate) {
        let updateOptions: StartUpdateOptions = {};
        if (Platform.OS === 'android') {
          // android only, on iOS the user will be promped to go to your app store page
          updateOptions = {
            updateType: IAUUpdateKind.IMMEDIATE,
          };
        } else if (Platform.OS === 'ios') {
          updateOptions = {
            title: 'Update available',
            message:
              'There is a new version of the app available on the App Store, do you want to update it?',
            buttonUpgradeText: 'Update',
            forceUpgrade: true,
          };
        }
        inAppUpdates.startUpdate(updateOptions);
      }
    });
  }, []);

  return (
    <SafeAreaView>
      <Header />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text>Halo Ini hanya app untuk uji coba fitur secara prodution</Text>
          <Text>Version Number {DeviceInfo.getVersion()}</Text>
          <Text>Build Number {DeviceInfo.getBuildNumber()}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default codePush(App);
