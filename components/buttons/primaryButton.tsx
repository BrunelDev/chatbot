import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";

export function PrimaryButton({
  title,
  handlePress,
  disabled = false,
  showLoading = false,
  loadingValue,
  activeOpacity = 0.8,
  className,
}: {
  title: string;
  handlePress: () => void | Promise<void>;
  disabled?: boolean;
  showLoading?: boolean;
  loadingValue?: string;
  activeOpacity?: number;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : activeOpacity}
      className={`flex flex-row gap-3 h-[48px] w-full items-center justify-center rounded-[16px] ${
        disabled || (loading && showLoading)
          ? "bg-international_orange-300"
          : "bg-orange-400"
      } ${className}`}
      onPressOut={() => {
        try {
          if (!disabled) {
            setLoading(true);
            Promise.resolve(handlePress()).then(() => {
              setLoading(false);
            });
          }
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      }}
    >
      {showLoading && loading ? <Spinner color={colors.white} /> : null}
      <Text
        className={`${disabled ? "text-gray-500" : "text-big_stone"}`}
        style={{ fontFamily: "Urbanist" }}
      >
        {loading && showLoading ? loadingValue : title}
      </Text>
    </TouchableOpacity>
  );
}
