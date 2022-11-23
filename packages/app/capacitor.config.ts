import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.codecat.chat',
  appName: 'Quack',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_quack',
      iconColor: '#FF0000',
      sound: 'sound.mp3',
      vibrate: true,
    }
  }
};

export default config;
