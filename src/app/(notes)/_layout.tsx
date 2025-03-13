import { NotesDrawer } from "@/components/notesDrawer";
import { useNotes } from "@/providers/notesProvider";
import { Drawer as ExpoDrawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function NotesLayout() {
  return (
    <GestureHandlerRootView>
      <ExpoDrawer drawerContent={() => <NotesDrawer />}>
        <ExpoDrawer.Screen
          name="[noteId]"
          options={{
            headerShown: false,
          }}
        />
      </ExpoDrawer>
    </GestureHandlerRootView>
  );
}
