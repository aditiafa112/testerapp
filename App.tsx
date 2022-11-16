import React, {useEffect} from 'react';
import {
  Button,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';
import {Header} from 'react-native/Libraries/NewAppScreen';
import SpInAppUpdates, {
  IAUUpdateKind,
  NeedsUpdateResponse,
  StartUpdateOptions,
  StatusUpdateEvent,
} from 'sp-react-native-in-app-updates';

import codePush from 'react-native-code-push';

const codePushOptions = {checkFrequency: codePush.CheckFrequency.ON_APP_RESUME};

const App = () => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [isStatus, setIsStatus] = React.useState<any>();
  const [updateOptions, setUpdateOption] = React.useState<StartUpdateOptions>();
  const inAppUpdates = new SpInAppUpdates(false);

  useEffect(() => {
    inAppUpdates.checkNeedsUpdate().then((result: NeedsUpdateResponse) => {
      if (result.shouldUpdate) {
        if (Platform.OS === 'android') {
          // android only, on iOS the user will be promped to go to your app store page
          setUpdateOption({updateType: IAUUpdateKind.IMMEDIATE});
        } else if (Platform.OS === 'ios') {
          setUpdateOption({
            title: 'Update available',
            message:
              'There is a new version of the app available on the App Store, do you want to update it?',
            buttonUpgradeText: 'Update',
            forceUpgrade: true,
          });
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isStatus !== undefined) {
      if (isStatus === 4) {
        removeStatusUpdateListener();
      }
    }
  }, [isStatus]);

  const startUpdate = () => {
    if (updateOptions !== undefined) {
      inAppUpdates.addStatusUpdateListener((props: StatusUpdateEvent) => {
        const {status} = props;
        setIsStatus(status);
      });
      inAppUpdates.startUpdate(updateOptions);
    }
  };

  return (
    <SafeAreaView>
      <Header />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text>Halo Ini hanya app untuk uji coba fitur secara prodution</Text>
          <Text>Version Number {DeviceInfo.getVersion()}</Text>
          <Text>Build Number {DeviceInfo.getBuildNumber()}</Text>
          <Text>Mencoba CodePush</Text>
          <Text>Mencoba CodePush 2</Text>
          <Text>6(1.1)</Text>
          <Text>{isStatus}</Text>
        </View>
      </ScrollView>
      {updateOptions === undefined ? null : (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,0.5)',
            height: windowHeight,
            width: windowWidth,
            display: 'flex',
            justifyContent: 'center',
          }}>
          <Button
            onPress={startUpdate}
            title="update"
            disabled={updateOptions === undefined}
          />
          <Text>Overlay</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default codePush(codePushOptions)(App);
function removeStatusUpdateListener() {
  throw new Error('Function not implemented.');
}
