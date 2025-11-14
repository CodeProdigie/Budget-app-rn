import { Slot, Stack } from "expo-router";
import React from "react";
import "../global.css";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeArea from "./components/SafeArea";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { ContextProvider } from "./api/contextApi";

export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <ContextProvider>
        <Slot />
        <StatusBar backgroundColor="#000" />
      </ContextProvider>
    </ClerkProvider>
  );
}
