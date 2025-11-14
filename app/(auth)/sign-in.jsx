import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Image, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import SafeArea from "../components/SafeArea"
import { SafeAreaView } from 'react-native-safe-area-context'


export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <SafeAreaView className ='flex-1 flex-col items-center justify-center bg-[#FFF9F5] gap-4'>
       <Image source={require('@/assets/revenue-i4.png')} className='size-[320px]' />
      <Text className="text-4xl font-bold text-black">Welcome Back</Text>
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter your email address"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        className='border w-11/12 py-4 px-4 text-xl rounded-xl border-stone-500 text-black bg-slate-50'
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
          className='border w-11/12 py-4 px-4 text-xl rounded-xl border-stone-500 text-black bg-slate-50'
      />
      <TouchableOpacity onPress={onSignInPress} className='border w-11/12 py-4 px-4 text-xl rounded-xl border-stone-500  bg-[#68442d]'>
        <Text className='text-white text-center text-xl'>Sign In</Text>
      </TouchableOpacity>
      <View style={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
        <Link href="/sign-up">
          <Text>Don't have an account?  <Text className='text-md text-[#68442d] font-semibold'>Sign up</Text></Text>
        </Link>
      </View>
    </SafeAreaView>
  )
}