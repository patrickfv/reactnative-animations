import {Text, StatusBar, SafeAreaView, Dimensions} from 'react-native'
import { Headspace } from './src/Headspace'
const { height, width } = Dimensions.get("window")

const App = () => {
  return (
    <SafeAreaView style={{
      height,
      width,
      backgroundColor: "#2a7fb8"
    }}>
      <StatusBar/>
      <Headspace />
    </SafeAreaView>
  )
}

/*
  r = 100
  A = 60.00
  F = 0.02
  C = 0.55198475
  C1 = C * r
*/

export default App