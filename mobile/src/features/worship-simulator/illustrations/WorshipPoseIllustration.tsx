import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import type { IllustrationTheme } from './tokens';
import { ILLUSTRATION_PALETTES, ILLUSTRATION_VIEWBOX } from './tokens';
import { POSE_GEOMETRY } from './poseGeometry';
import type { WorshipPose } from '../types';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface WorshipPoseIllustrationProps {
  pose: WorshipPose;
  theme: IllustrationTheme;
  /** Thumbnail — simplified, smaller effective scale */
  variant?: 'full' | 'thumb';
  animated?: boolean;
}

/** Custom Jafari worship figure — SVG + Reanimated micro-motion (no external GIFs). */
export function WorshipPoseIllustration({
  pose,
  theme,
  variant = 'full',
  animated = true,
}: WorshipPoseIllustrationProps) {
  const palette = ILLUSTRATION_PALETTES[theme];
  const geo = POSE_GEOMETRY[pose];
  const scale = variant === 'thumb' ? 0.72 : 1;
  const vbW = ILLUSTRATION_VIEWBOX.width;
  const vbH = ILLUSTRATION_VIEWBOX.height;

  const waterPulse = useSharedValue(0);
  const breathe = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    waterPulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [animated, waterPulse, breathe]);

  const waterProps = useAnimatedProps(() => ({
    opacity: 0.35 + waterPulse.value * 0.45,
  }));

  const torsoProps = useAnimatedProps(() => ({
    ry: 18 + breathe.value * 1.5,
  }));

  const cx = vbW / 2;
  const baseY = 48 + geo.figureY;
  const headCy = baseY - 28 + geo.headY;
  const torsoCy = baseY + 18;
  const legY = geo.sitting ? baseY + 52 : baseY + 58;

  const renderArm = (side: 'left' | 'right', rot: number, extY: number) => {
    const sign = side === 'left' ? -1 : 1;
    const x1 = cx + sign * 14;
    const y1 = torsoCy - 4;
    const rad = (rot * Math.PI) / 180;
    const len = geo.handsRaised ? 36 : 32;
    const x2 = x1 + Math.sin(rad) * len * sign;
    const y2 = y1 + Math.cos(rad) * len + extY;
    return (
      <G key={side}>
        <Line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={palette.figurePrimary}
          strokeWidth={7}
          strokeLinecap="round"
        />
        <Circle cx={x2} cy={y2} r={5} fill={palette.figureSecondary} />
      </G>
    );
  };

  const renderWater = () => {
    if (geo.waterZones.length === 0) return null;
    return geo.waterZones.map((zone) => {
      switch (zone) {
        case 'face':
          return (
            <AnimatedEllipse
              key="face-water"
              animatedProps={waterProps}
              cx={cx}
              cy={headCy}
              rx={22}
              ry={18}
              fill={palette.water}
            />
          );
        case 'arm_r':
          return (
            <AnimatedEllipse
              key="arm-r-water"
              animatedProps={waterProps}
              cx={cx + 38}
              cy={torsoCy + 8}
              rx={12}
              ry={28}
              fill={palette.water}
              rotation={-15}
              origin={`${cx + 38}, ${torsoCy + 8}`}
            />
          );
        case 'arm_l':
          return (
            <AnimatedEllipse
              key="arm-l-water"
              animatedProps={waterProps}
              cx={cx - 38}
              cy={torsoCy + 8}
              rx={12}
              ry={28}
              fill={palette.water}
              rotation={15}
              origin={`${cx - 38}, ${torsoCy + 8}`}
            />
          );
        case 'head':
          return (
            <AnimatedEllipse
              key="head-masah"
              animatedProps={waterProps}
              cx={cx}
              cy={headCy - 6}
              rx={20}
              ry={8}
              fill={palette.waterHighlight}
            />
          );
        case 'feet':
          return (
            <AnimatedEllipse
              key="feet-masah"
              animatedProps={waterProps}
              cx={cx}
              cy={legY + 34}
              rx={26}
              ry={8}
              fill={palette.waterHighlight}
            />
          );
        case 'immersion':
          return (
            <AnimatedEllipse
              key="immersion"
              animatedProps={waterProps}
              cx={cx}
              cy={torsoCy + 40}
              rx={70}
              ry={50}
              fill={palette.water}
            />
          );
        default:
          return null;
      }
    });
  };

  return (
    <View style={[styles.wrap, { transform: [{ scale }] }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${vbW} ${vbH}`}>
        <Defs>
          <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={palette.background} stopOpacity="1" />
            <Stop offset="1" stopColor={palette.ground} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={vbW} height={vbH} fill="url(#bgGrad)" rx={12} />
        <Ellipse cx={cx} cy={vbH - 8} rx={58} ry={10} fill={palette.ground} opacity={0.8} />

        {renderWater()}

        <G
          rotation={geo.torsoRotate}
          origin={`${cx}, ${torsoCy}`}
        >
          {/* Legs */}
          {geo.sitting ? (
            <>
              <Path
                d={`M ${cx - 8} ${legY} Q ${cx - 28} ${legY + 18} ${cx - 22} ${legY + 32} L ${cx - 8} ${legY + 32} Z`}
                fill={palette.figurePrimary}
              />
              <Path
                d={`M ${cx + 8} ${legY} Q ${cx + 28} ${legY + 18} ${cx + 22} ${legY + 32} L ${cx + 8} ${legY + 32} Z`}
                fill={palette.figurePrimary}
              />
            </>
          ) : (
            <>
              <Line
                x1={cx - 10}
                y1={legY}
                x2={cx - 14}
                y2={legY + 38}
                stroke={palette.figurePrimary}
                strokeWidth={8}
                strokeLinecap="round"
              />
              <Line
                x1={cx + 10}
                y1={legY}
                x2={cx + 14}
                y2={legY + 38}
                stroke={palette.figurePrimary}
                strokeWidth={8}
                strokeLinecap="round"
              />
            </>
          )}

          <AnimatedEllipse
            animatedProps={animated ? torsoProps : undefined}
            cx={cx}
            cy={torsoCy}
            rx={16}
            ry={18}
            fill={palette.figurePrimary}
          />
          <Circle cx={cx} cy={headCy} r={14} fill={palette.figureSecondary} stroke={palette.figureStroke} strokeWidth={1.5} />

          {renderArm('left', geo.leftArm[0], geo.leftArm[1])}
          {renderArm('right', geo.rightArm[0], geo.rightArm[1])}
        </G>

        {geo.prostration ? (
          <Rect x={cx - 18} y={headCy + 18} width={36} height={4} rx={2} fill={palette.accentMuted} />
        ) : null}

        {pose === 'completion_dhikr' ? (
          <G>
            <Circle cx={cx - 20} cy={headCy - 36} r={3} fill={palette.accent} opacity={0.6} />
            <Circle cx={cx} cy={headCy - 40} r={3} fill={palette.accent} opacity={0.8} />
            <Circle cx={cx + 20} cy={headCy - 36} r={3} fill={palette.accent} opacity={0.6} />
          </G>
        ) : null}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    height: '100%',
  },
});
