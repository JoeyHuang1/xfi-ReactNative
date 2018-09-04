# xfi-ReactNative
Implemented by React-native 

## Run
yarn install

react-native run-ios or react-native run-android


## Note:

### A. To run on Android simulator

Need to set path to Android adb first, like
export PATH="/Users/yourUser/Library/Android/sdk/platform-tools":$PATH




### B. Problems for Android
#### run-android error about Java SDK
In android/gradle/gradle-wrapper/gradle-wrapper.properties file, ay use different gradle version for JDK 10
For jdk 10, may need to use following gradle according to
https://stackoverflow.com/questions/46867399/react-native-error-could-not-determine-java-version-from-9-0-1

> distributionUrl=https\://services.gradle.org/distributions/gradle-3.5.1-all.zip

or

> distributionUrl=https\://services.gradle.org/distributions/gradle-4.3-rc-2-all.zip

#### run-android error about Android SDK
May need to set ANDROID_HOME in android/local.properties file
sdk.dir = /Users/joey/Library/Android/sdk

#### run-android error about Java Path
May need to use Java 8
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_171.jdk/Contents/Home

#### Thermolist is missing after login
The same web content work well in iOS. For Android request, server returns thermostats without attribSet attribute, even the request data is the same as iOS. Need server to fix it, or use API for individual device, rather than /seeds API.
