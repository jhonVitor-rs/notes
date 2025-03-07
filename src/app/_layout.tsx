import { View } from "react-native";
import "./global.css";
import { Tabs } from "expo-router";
import { useKeyboard } from "@10play/tentap-editor";
import { TabBar } from "@/components/navigation/tabBar";

export default function Layout() {
  const { isKeyboardUp } = useKeyboard();

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Notes" }} />
      <Tabs.Screen
        name="notes/[note]"
        options={{ href: null, header: () => <View className="hidden" /> }}
      />
    </Tabs>
  );
}
