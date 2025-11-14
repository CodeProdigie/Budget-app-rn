import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons';

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    Alert.alert("logout","Are you sure you want to logout?",[
      {text:'Cancel', style:'cancel'},
      {text:'Logout', style:'destructive', onPress: signOut}
    ])
 
  }
  return (
    <TouchableOpacity onPress={handleSignOut}>
       <Feather name="log-out" size={20} color="grey" />
    </TouchableOpacity>
  )
}