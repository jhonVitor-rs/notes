import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex flex-col items-center justify-center w-full min-h-screen">
      <Text>Index</Text>
      <Link href={"/notes/example"}>Notes</Link>
    </View>
  );
}
