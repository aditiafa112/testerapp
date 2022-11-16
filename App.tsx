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

import codePush, {CodePushOptions} from 'react-native-code-push';

const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  installMode: codePush.InstallMode.IMMEDIATE,
};

const App = () => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [isStatus, setIsStatus] = React.useState<any>();
  const [updateOptions, setUpdateOption] = React.useState<StartUpdateOptions>();
  const inAppUpdates = new SpInAppUpdates(false);

  const [isSync, setIsSync] = React.useState<any>();
  const [isProgress, setIsProgess] = React.useState<any>();

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

    codePush.sync(
      undefined,
      status => {
        switch (status) {
          case codePush.SyncStatus.CHECKING_FOR_UPDATE:
            console.log('Checking for updates.');
            break;
          case codePush.SyncStatus.DOWNLOADING_PACKAGE:
            console.log('Downloading package.');
            setIsSync(true);
            break;
          case codePush.SyncStatus.INSTALLING_UPDATE:
            console.log('Installing update.');
            break;
          case codePush.SyncStatus.UP_TO_DATE:
            console.log('Up-to-date.');
            setIsSync(false);
            break;
          case codePush.SyncStatus.UPDATE_INSTALLED:
            console.log('Update installed.');
            setIsSync(false);
            setIsProgess(undefined);
            break;
        }
      },
      ({receivedBytes, totalBytes}) => {
        /* Update download modal progress */
        setIsProgess({receivedBytes, totalBytes});
      },
    );
  }, []);

  useEffect(() => {
    if (isStatus !== undefined) {
      if (isStatus === 4) {
        inAppUpdates.removeStatusUpdateListener(() => {});
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
          <Text>test</Text>
          <Text>{isStatus}</Text>
        </View>
      </ScrollView>
      {isSync === true ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#f1f1f1',
            height: 20,
            width: windowWidth,
            display: 'flex',
            alignItems: 'center',
          }}>
          <Text>
            {isProgress?.receivedBytes} / {isProgress?.totalBytes}
          </Text>
        </View>
      ) : null}
      {isSync === undefined ? (
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#f1f1f1',
            height: 20,
            width: windowWidth,
            display: 'flex',
            alignItems: 'center',
          }}>
          <Text>
            sync apps
          </Text>
        </View>
      ) : null}
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
