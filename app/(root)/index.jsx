import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SignOutButton } from "../components/SignOutButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useContextApi } from "../api/contextApi";
import { useEffect } from "react";
import Activities from "../components/Activities";

export default function Page() { 
  const { user } = useUser();
  const { summary, summarydata, loading, delSummary } = useContextApi();
  const router = useRouter();

  // useEffect(() => {
  // summary(user.id);

  useEffect(() => {
    console.log(user?.id)
    if (user?.id) { 
      summary(user.id);
    }
  }, [user?.id]);
  // }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#ffe7d7]">
      <SignedIn>
        {/* top bar */}
        <View className="flex-row justify-around bg-[#f9dac3] py-2">
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/logo.png")}
              className="size-[70px]"
            />
            <View>
              <Text>Welcome</Text>
              <Text className="text-[12px]">
                {user?.emailAddresses[0].emailAddress}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              className="bg-[#ae622f] py-2 px-4 rounded-3xl flex-row items-center gap-1"
              onPress={() => router.push("create-transaction")}
            >
              <Feather name="plus" size={16} color="#FFF" />
              <Text className="text-white text-normal text-lg">Add</Text>
            </TouchableOpacity>

            <SignOutButton />
          </View>
        </View>

        {/* middle bar */}
        <View className="bg-white w-11/12 py-2 px-3 mx-2 my-4 rounded-xl flex-col gap-1">
          <Text className="text-slate-500">Total Balance</Text>
          <Text className="text-3xl font-semibold text-slate-600">
            CFA{summarydata?.summary?.balance}.00
          </Text>
          <View className="flex-row justify-between px-3">
            <View>
              <Text className="text-slate-500 text-center">Income</Text>
              <Text className="text-green-500 text-xl">
                CFA{summarydata?.summary?.income}.00
              </Text>
            </View>
            <View className="flex-row gap-1 items-center">
              <Text className="text-4xl text-slate-400 font-thin">|</Text>
              <View>
                <Text className="text-slate-500 text-center">Expenses</Text>
                <Text className="text-red-500 text-xl">
                  CFA{summarydata?.summary?.expense}.00
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom bar - FIXED */}
        <View className="flex-1 px-4">
          <Text className="text-lg font-semibold mb-4">
            Recent Transactions
          </Text>
          {loading && <ActivityIndicator size={40} color="#000" />}
          <FlatList
            data={summarydata?.data || []}
            renderItem={({ item }) => (
              <Activities Del={delSummary} item={item} />
            )}
            keyExtractor={(item) => item._id}
            ListEmptyComponent={() => (
              <View className="py-4 flex-col items-center justify-center">
                <Image 
                  source={require("@/assets/revenue-i3.png")}
                  className="size-[180px]"
                />
                <Text className="text-gray-500 text-xl font-medium">
                  No transactions yet
                </Text>
                <TouchableOpacity
                  className="bg-[#ae622f] py-3 px-4 rounded-3xl flex-row items-center gap-1 mt-10"
                  onPress={() => router.push("create-transaction")}
                >
                  <Feather name="plus" size={16} color="#FFF" />
                  <Text className="text-white text-normal text-xl">
                    Create New Transaction
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </SafeAreaView>
  );
}
