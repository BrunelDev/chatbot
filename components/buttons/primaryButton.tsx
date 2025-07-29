import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
      className={`relative flex flex-row gap-3 h-[48px] w-full items-center justify-center rounded-[16px] bg-[#587950] ${className}`}
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
      <Text className="text-white" style={{ fontFamily: "Urbanist" }}>
        {loading && showLoading ? loadingValue : title}
      </Text>
      {(disabled ||
        (loading && showLoading)) && (
          <View className="absolute top-0 left-0 w-full h-full bg-[#f4f8f98a] rounded-[16px]" />
        )}
    </TouchableOpacity>
  );
}
