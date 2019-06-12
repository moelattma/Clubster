1. Create a new directory (preferably called 'Clubster').
2. Clone directory from: https://github.com/moelattma/Clubster
3. Install Android Studios (if not installed already)
4. Launch Android Studios and open the Android Virtual Device (AVD) Manager,
   create a virtual device, and open the device.
5. Open your preferred browser.
6. Open two terminal windows/tab
	a. In the first window/tab, navigate to Clubster/clubster-backend
	   and run the following commands:
	       i.   npm install bcrypt
	       ii.  npm install multer
	       iii. adb reverse tcp: 3000 tcp: 3000
	       iv.  npm run dev
	b. In the second window/tab, navigate to Clubster/clubster-mobile
	   and run the following commands:
	       i.   npm install
	       ii.  npm install -g expo-cli (If you do not have expo)
	       iii. expo start
7. Once the Metro Bundler tab opens in your browser, click on 'Run on Android
   Device/emulator'. You will be able to run the app on your emulator (If the
   tab does not open in your browser, go to the address: 
   'http://localhost:19002/'. Everything else is the same).
8. Note: If the app doesn't recognize some node_module, just do 'npm install 
   <module>' the folder that complained. For example, if "Does not know 
   react-native-form' is shown, use the command: 
   'npm install react-native-form'. This should happen very rarely if not ever.
   Npm install installs an exhaustive list of node projects, so due to 
   computer bandwidth or performance limitations, it may have trouble
   installing each required dependancy.
ALTERNATIVELY:
	1. use terminal and open clubster/clubster-mobile
	2. use command: expo start --tunnel
	3. open 'http://localhost:19002
	4. install expo on phone
	5. open expo
	6. scan QR code
