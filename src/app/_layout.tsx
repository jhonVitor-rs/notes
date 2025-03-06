import "./global.css";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <Tabs tabBar={props => ()}>
      <Tabs.Screen name="notes/index" options={{ title: "Notes" }} />
    </Tabs>
  );
}
