import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { View } from "react-native";
import { TabBarButtom } from "./tabBarButtom";
import { useKeyboard } from "@10play/tentap-editor";

const excludeRoutes = ["_sitemap", "notes/[note]", "+not-found"];

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const primaryColor = "#f79605";
  const greyColor = "#737373";
  const { isKeyboardUp } = useKeyboard();

  // const currentRouteName = state.routes[state.index].name;
  // const shouldHideTabBar =
  //   isKeyboardUp || excludeRoutes.includes(currentRouteName);

  return (
    <View
      style={{
        display: isKeyboardUp ? "none" : "flex",
      }}
      className="absolute bottom-6 flex-row justify-between items-center bg bg-slate-800 mx-5 py-3 rounded-3xl shadow-black/10"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (excludeRoutes.includes(route.name)) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButtom
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
          />
        );
      })}
    </View>
  );
}
