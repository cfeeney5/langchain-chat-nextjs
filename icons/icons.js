import { Svg, G, Path } from "react-native-svg";

export function PersonIcon(props) {
  let colour = props.colour || "#FFFFFF";

  return (
    <Svg
      viewBox="0 0 558 558"
      width={props.width}
      height={props.width * (558 / 558)}
      fill={colour}
    >
      <G>
        <Path
          d="M186.8,124.7C191.6,73.6,237.4,48,288.5,48c51.1,0,96.9,25.6,101.7,76.7c2.5,26.7-3.5,89.9-16.8,113.8
     c-11.6,20.9-38.6,41-68.6,47.9c-14.5,2.1-18.1,2.1-32.6,0c-30-6.9-57-27-68.6-47.9C190.3,214.6,184.4,151.4,186.8,124.7
     L186.8,124.7z"
        />
        <Path d="M475.9,468l2.6-47.4c7.8-143.4-387.7-143.1-380,0l2.6,47.4C226,510.8,351,511,475.9,468z" />
      </G>
    </Svg>
  );
}
