import {StatusBar} from 'expo-status-bar';
import {useFonts} from 'expo-font';
import {ContextProvider} from './store/context';
import Navigator from './components/Navigator';

export default function App() {
  const [loaded] = useFonts({'SpaceGrotesk': require('./assets/SpaceGrotesk.ttf')});
  
  if (!loaded) {
    return;
  }

  return (
    <>
      <StatusBar style='light'/>
      <ContextProvider>
        <Navigator/>
      </ContextProvider>
    </>
  );
}