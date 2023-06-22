import React, { useEffect, useState } from "react";
import { View, Button, ActivityIndicator } from "react-native";
import * as ImagePicker from 'expo-image-picker';


export function Screen(){
    /**
     * {"canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}
     */
    const [loading, setLoading] = useState(false)

    

    useEffect(()=>{
       // if(!status?.granted) {
            //requestPermission()
        //}
        async function reqPermission(){            
            //await ImagePicker.requestCameraPermissionsAsync()

            await ImagePicker.requestCameraPermissionsAsync()
            await ImagePicker.requestMediaLibraryPermissionsAsync()

        }
        reqPermission()
    },[])

    async function launchCamera(){
    
        /**
         * 
         * expo is throwing a error with Android 13>
         * the problem was fixed by expo community and will be released in new expo release
         * for a while i use a package-patch to modify native code
         */
            setLoading(true)
            await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
            })
            .then(d=>console.log(d))
            .catch(e=>console.log(e))
            .finally(()=>{
                setLoading(false)
            })
        


     
    }
  
    async function launchGallery() {
        await ImagePicker.requestMediaLibraryPermissionsAsync()

        setLoading(true)
        await ImagePicker.launchImageLibraryAsync()
        .then(d=>console.log(d))
        .catch(e=>console.log(e))
        .finally(()=>{
            setLoading(false)
        })
    }
    
    return (
        <View style={{
            flex:1,
            alignItems:'center',
            justifyContent:'center'
        }}>  
            {loading && (
                <View style={{width:'100%', marginVertical:10}}>
                <ActivityIndicator />
                </View>
            )}
         
            <Button title={"Take a picture"} onPress={()=>launchCamera()}/>
            <View style={{height:2}} />
            <Button title={"Pic from gallery"} onPress={()=>launchGallery()} />
        </View>
    )
}