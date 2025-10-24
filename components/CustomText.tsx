import React from "react";
import { Text as RNText, TextProps } from "react-native";

interface CustomTextProps extends TextProps {
  fontFamily?: string;
}

export const Text = React.forwardRef<any, CustomTextProps>((props, ref) => {
  const { style, fontFamily, ...otherProps } = props;

  // WorkSans comme police par défaut, sauf si une autre police est spécifiée
  const defaultStyle = { fontFamily: fontFamily || "WorkSans" };

  const combinedStyle = Array.isArray(style)
    ? [defaultStyle, ...style]
    : [defaultStyle, style];

  return <RNText ref={ref} style={combinedStyle} {...otherProps} />;
});

Text.displayName = "Text";

export default Text;
