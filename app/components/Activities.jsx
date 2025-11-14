import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

const Activities = ({ item, Del }) => {
//   console.log("Rendering item:", item);
  // Format date
  const date = new Date(item?.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Determine if income or expense  
  const isIncome = Number(item?.amount) > 0; 

  const handleDelete = (userId,id) => {
      Alert.alert("Delete Transaction", "Are you sure you want to delete this Transaction",[
        {text:'Cancel', style:'cancel'},
        {text:'Delete',style:'destructive', onPress: ()=> Del(userId,id)}
      ])
  }

  return (
   
    <View className="bg-white py-4 px-3 rounded-md flex-row items-center justify-between mb-2">
      {/* left hand */}
      <View className="flex-row items-center gap-2">
        <Feather
          name={isIncome ? "arrow-down-circle" : "arrow-up-circle"}
          size={20}
          color={isIncome ? "green" : "red"}
        />
        <View>
          <Text className="font-medium">{item?.title}</Text>
          <Text className="text-slate-500">{item?.category}</Text>
        </View>
      </View>
      {/* right hand */}
      <View className="flex-row items-center gap-2">
        <View>
          <Text
            className={`font-semibold ${isIncome ? "text-green-600" : "text-red-600"}`}
          >
            {isIncome ? "+" : "-"}CFA
            {Math.abs(item?.amount || 0).toLocaleString()}
          </Text>
          <Text className="text-slate-500 text-right">{date}</Text>
        </View>
        <Text className="text-5xl text-slate-400 font-thin">|</Text>
        <TouchableOpacity onPress={()=> handleDelete(item?.user_id,item?._id)}>
          <Feather name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Activities;
