import { useTiming, vec, Canvas, useTouchHandler, useClockValue, useComputedValue, Skia, Path, useContextBridge } from "@shopify/react-native-skia"
import { useState, useEffect } from "react"
import { Dimensions } from "react-native"
import { Easing } from "react-native-reanimated"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"
import { createNoise2D } from "simplex-noise"
import { Play } from "./Play"

const { width, height } = Dimensions.get("window")
const C = 0.55228474983079;
const F = 20000;
const A = 0.2;
const c = vec(width / 2, height / 2);
const r = 50;
const n1 = createNoise2D();
const n2 = createNoise2D();
const n3 = createNoise2D();
const n4 = createNoise2D();

const Headspace = () => {
  const [toggled, setToggled] = useState(false)
  const clock = useClockValue()
  const onTouch = useTouchHandler({
    onEnd: () => {
      setToggled(t => !t)
    }
  })
  useEffect(() => {
    if (toggled) {
      clock.start()
    } else {
      clock.stop()
    }
  }, [clock, toggled])
  const path = useComputedValue(() => {
    const C1 = C + A * n1(clock.current / F, 0);
    const C2 = C + A * n2(clock.current / F, 0);
    const C3 = C + A * n3(clock.current / F, 0);
    const C4 = C + A * n4(clock.current / F, 0);
    const p = Skia.Path.Make();
    p.moveTo(c.x, c.y - r);
    p.cubicTo(c.x + C1 * r, c.y - r, c.x + r, c.y - C1 * r, c.x + r, c.y);
    p.cubicTo(c.x + r, c.y + C2 * r, c.x + C2 * r, c.y + r, c.x, c.y + r);
    p.cubicTo(c.x - C3 * r, c.y + r, c.x - r, c.y + C3 * r, c.x - r, c.y);
    p.cubicTo(c.x - r, c.y - C4 * r, c.x - C4 * r, c.y - r, c.x, c.y - r);
    const m = Skia.Matrix();
    m.translate(c.x, c.y);
    m.rotate(clock.current / 1000);
    m.translate(-c.x, -c.y);
    p.transform(m);
    return p
  }, [clock])
  const progress = useTiming(toggled ? 1 : 0, {
    duration: 450,
    easing: Easing.inOut(Easing.ease)
  })
  const ContextBridge = useContextBridge(SafeAreaInsetsContext)
  return (
    <Canvas style={{ flex: 1 }} onTouch={onTouch}>
      <ContextBridge>
        <Path path={path} color={"#2ab8aa"}/>
        <Play progress={progress} c={c} r={r}/>
      </ContextBridge>
    </Canvas>
  )
}

export default Headspace