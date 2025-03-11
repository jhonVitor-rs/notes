import "./global.css";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";
import { PaperProvider, DefaultTheme, MD3Theme } from "react-native-paper";
import { TabBar } from "@/components/navigation/tabBar";
import { NotesProvider } from "@/providers/notesProvider";

const theme: MD3Theme = {
  ...DefaultTheme,
  dark: true,
  mode: undefined,
};

export default function Layout() {
  return (
    <NotesProvider>
      <PaperProvider theme={theme}>
        <Tabs tabBar={(props) => <TabBar {...props} />}>
          <Tabs.Screen
            name="(tasks)/index"
            options={{
              title: "Tasks",
              href: { pathname: "/(tasks)" },
              header: () => <Header title="Tasks" />,
            }}
          />
          <Tabs.Screen
            name="(notes)"
            options={{
              title: "Notes",
              href: { pathname: "/(notes)/[noteId]", params: { noteId: "" } },
              headerShown: false,
            }}
          />
        </Tabs>
      </PaperProvider>
    </NotesProvider>
  );
}

function Header({ title }: { title: string }) {
  return (
    <View className="flex flex-col w-full items-start justify-center h-16 px-4 bg-slate-900">
      <Text className="text-cyan-600 font-bold text-2xl">{title}</Text>
    </View>
  );
}
