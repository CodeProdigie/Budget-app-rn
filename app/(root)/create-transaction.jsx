import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useContextApi } from "../api/contextApi";
import { useUser } from "@clerk/clerk-expo";

const CreateTransaction = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("expense"); // "expense" or "income"
  const { user } = useUser();
  const router = useRouter();

  const { createTrans } = useContextApi();

  const Category = [
    {
      id: 1,
      title: 'Food & drinks',
      icon: 'coffee'
    },
    {
      id: 2,
      title: 'Shopping',
      icon: 'shopping-cart'
    },
    {
      id: 3,
      title: 'Transportation',
      icon: 'truck'
    },
    {
      id: 4,
      title: 'Entertainment',
      icon: 'film'
    },
    {
      id: 5,
      title: 'Bills',
      icon: 'credit-card'
    },
    {
      id: 6,
      title: 'Income',
      icon: 'dollar-sign'
    },
    {
      id: 7,
      title: 'Other',
      icon: 'more-horizontal'
    },
  ];

  const HandleSave = () => {
    // Validation
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a transaction title");
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    
    if (!category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    Alert.alert("Save Transaction", "Create new transaction?", [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Save',
        style: 'default',
        onPress: async () => {
          setLoading(true);
          try {
            // Convert amount to negative if it's an expense
            const finalAmount = transactionType === "expense" 
              ? -Math.abs(Number(amount)) 
              : Math.abs(Number(amount));
            
            await createTrans(user?.id, title.trim(), finalAmount, category);
            Alert.alert("Success", "Transaction created successfully");
            router.push('/');
          } catch (error) {
            console.error("Error saving transaction:", error);
            Alert.alert(
              "Error", 
              "Failed to create transaction. Please try again."
            );
          } finally {
            setLoading(false);
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#ffe7d7]">
      {/* Loading overlay */}
      {loading && (
        <View className="absolute inset-0 bg-black/30 z-50 items-center justify-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Top bar */}
      <View className="flex-row items-center justify-between py-5 px-2 border-b border-b-slate-400">
        <TouchableOpacity onPress={() => router.back()} disabled={loading}>
          <Feather name="arrow-left" color="black" size={22} />
        </TouchableOpacity>
        <Text className="text-2xl font-medium text-slate-700">New Transaction</Text>
        <TouchableOpacity
          onPress={HandleSave}
          className="flex-row items-center gap-2"
          disabled={loading}
        >
          <Text className="text-xl">Save</Text>
          <Feather name="check" color="black" size={12} />
        </TouchableOpacity>
      </View>

      {/* Middle bar 1 */}
      <View className='bg-[#efd7c3] w-11/12 py-4 px-3 mx-4 my-4 rounded-md'>
        <View className='flex-row items-center justify-between'>
          {/* Expense Button */}
          <TouchableOpacity 
            className={`w-[150px] py-3 rounded-2xl flex flex-row items-center justify-center gap-2 ${
              transactionType === "expense" 
                ? 'bg-stone-700' 
                : 'border border-slate-600'
            }`}
            onPress={() => setTransactionType("expense")}
            disabled={loading}
          >
            <Feather
              name="arrow-down"
              color={transactionType === "expense" ? "black" : "white"}
              size={18}
              className='size-7 px-1 py-[2px] bg-white rounded-full'
            />
            <Text className={transactionType === "expense" ? 'text-white text-xl' : 'text-xl'}>
              Expense
            </Text>
          </TouchableOpacity>

          {/* Income Button */}
          <TouchableOpacity 
            className={`w-[150px] py-3 rounded-2xl flex flex-row items-center justify-center gap-2 ${
              transactionType === "income" 
                ? 'bg-stone-700' 
                : 'border border-slate-600'
            }`}
            onPress={() => setTransactionType("income")}
            disabled={loading}
          >
            <Feather
              name="arrow-up"
              color="white"
              size={18}
              className='size-7 px-1 py-[2px] bg-green-500 rounded-full'
            />
            <Text className={transactionType === "income" ? 'text-white text-xl' : 'text-xl'}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View className='flex-row items-center gap-2 border my-3 px-3 rounded-md border-stone-400 bg-white'>
          <Text className='text-3xl'>CFA</Text>
          <TextInput
            className='flex-1 text-3xl py-2'
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
            editable={!loading}
          />
        </View>

        {/* Title Input */}
        <View className='flex-row items-center gap-2 border my-3 px-3 rounded-md border-stone-400 bg-white'>
          <Ionicons name="book-outline" size={15} />
          <TextInput
            className='flex-1 text-2xl py-2'
            placeholder="transaction title"
            value={title}
            onChangeText={(text) => setTitle(text)}
            editable={!loading}
          />
        </View>

        {/* Category Section */}
        <View className='px-2 mt-5'>
          <View className='flex-row items-center gap-2'>
            <Feather name='book' size={18} />
            <Text className='text-2xl font-medium'>Category</Text>
          </View>
          
          {/* Selected category indicator */}
          {category && (
            <Text className='text-sm text-slate-600 mt-2'>
              Selected: {category}
            </Text>
          )}

          {/* Category list */}
          <View className='mt-5 flex-row items-center flex-wrap gap-2 w-full'>
            {Category.map(({ id, title: catTitle, icon }) => (
              <TouchableOpacity
                className={`flex-row items-center gap-1 border rounded-xl py-2 px-5 max-w-[140px] ${
                  category === catTitle ? 'bg-stone-700 border-stone-700' : 'border-stone-400'
                }`}
                key={id}
                onPress={() => setCategory(catTitle)}
                disabled={loading}
              >
                <Feather 
                  name={icon} 
                  size={18} 
                  color={category === catTitle ? 'white' : 'black'}
                />
                <Text className={`text-md font-medium ${
                  category === catTitle ? 'text-white' : 'text-black'
                }`}>
                  {catTitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreateTransaction;