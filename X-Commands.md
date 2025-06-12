// command to solve any problem related to android folder
npx expo prebuild --clean 

 

// command to build APK for android  
npx eas build -p android --profile preview



// command to build APK for ios 
npx eas build -p ios --profile preview




----------------

if you dont see ios folder when building do this =>

npm install -g eas-cli : instaling 

npx eas build:configure   : it creates eas.json


npx eas build --platform all    :   to create a single apk for both 



----------------
expo run:android : to Install the development build 

----------------
to know exactly your IP adress of localhost you need to type this command : ipconfig and check the IPV4 field from the 4 fields 