import React, { useEffect, useState } from "react";
import { View, Button, ActivityIndicator, FlatList, Image, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

/**
 * 
 * {"assets": 
*    [
        {"assetId": null, 
        "base64": null, 
        "duration": null, 
        "exif": null, 
        "height": 1280, 
        "rotation": null, 
        "type": "image", 
        "uri": "file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540matheusxreis%252FCamAndPicker/ImagePicker/6777cc1c-8c20-4df9-8333-cd44136a48e1.jpeg", 
        "width": 960
        }
      ], 
   "canceled": false, 
   "cancelled": false}
 
 * 
 */

function ImageComponent({
    uri,
    selected,
    onPress  
}){


    if(selected) {
        return (
            <View style={{
                position:'relative'
            }}>
                <TouchableOpacity 
                    onPress={onPress}
                    activeOpacity={0.6}
                    style={{
                     position:'absolute',
                     zIndex:111,
                     top:0,
                     left:0,
                     width:'100%',
                     height:'100%',
                     opacity:0.8,
                     backgroundColor:"#213930",
                     alignItems:'center',
                     justifyContent:"center"
                }}>
                <Text style={{fontSize:30, color:"#fff"}}>✔</Text>
                </TouchableOpacity>
                <Image 
                style={{
                    borderWidth:2, 
                    width: 100, 
                    height: 200}}
                source={{uri}} />
            </View>
        )
    }
    return (
        <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}>

        <Image 
        style={{
            borderWidth:2, 
            width: 100, 
            height: 200}}
            source={{uri}} />
        </TouchableOpacity>
    )
}

export function Screen(){
    /**
     * {"canAskAgain": true, "expires": "never", "granted": false, "status": "undetermined"}
     */
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [selected, setSelected] = useState([])

    const [confirm, setConfirm] = useState(false)
    

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

    function onPress(i){
        if(selected.some(x=>x===i)){
            setSelected(selected.filter(x=>x!==i))
        }else {
            setSelected(prev=>prev.concat(i))
        }

    }

    function handleCancel(){
        setImages([])
    }
    function handleConfirm(){
        if(confirm){
            //TODO: SEND IMAGES SELECTES
            return;
        }
        setConfirm(true)
        setSelected(images)
    }
    function handleBack() {
        setConfirm(false)
    }
    function handlePhoto(obj){
        const d = obj.assets[0].uri
        setImages(prev=> prev.concat(d))
    }
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
                allowsMultipleSelection:true
            })
            .then(d=>handlePhoto(d))
            .catch(e=>console.log(e))
            .finally(()=>{
                setLoading(false)
            })
        


     
    }
    async function launchGallery() {
        await ImagePicker.requestMediaLibraryPermissionsAsync()
        setLoading(true)
        await ImagePicker.launchImageLibraryAsync()
        .then(d=>handlePhoto(d))
        .catch(e=>console.log(e))
        .finally(()=>{
            setLoading(false)
        })
    }
    
    return (
        <View style={{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            width:'100%',
            paddingTop:20
        }}>  
            {images.length>0 && (
                <View style={{width:'100%', 
                    backgroundColor:'#212930',
                    flexDirection:'row',
                    alignItems:'center',
                    justifyContent:'space-between'
                    }}>
                    <Text style={{color:"#ffffff"}}> {!confirm ? 'DO YOU WANT CONFIRM?' : `SELECTING ${selected.length} IMAGES`} </Text>
                    <View>
                        <Button title="OK" onPress={handleConfirm}/>
                        <View style={{height:1}}/>
                        {!confirm && <Button color="red" title="CANCEL" onPress={handleCancel}/>}
                        {confirm && <Button color="green" title="BACK" onPress={handleBack}/>}

                    </View>

                </View>
            )}
            {loading && (
                <View style={{width:'100%', marginVertical:10}}>
                <ActivityIndicator />
                </View>
            )}
         
         {!confirm && (
         <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Button title={"Take a picture"} onPress={()=>launchCamera()}/>
            <View style={{height:2}} />
            <Button title={"Pic from gallery"} onPress={()=>launchGallery()} />
         </View>
         )}

            {images.length>0 && !confirm && <Text>You have selected {images.length} {images.length===1 ? 'image' : 'images'}.</Text>}
            {images.length > 0 && (
                <FlatList 
                numColumns={4}
                style={{
                    width:'100%',
                    flex:1
                }}
                contentContainerStyle={{
                    alignItems:'flex-start',
                    justifyContent:'flex-start',
                }}
                data={images}
                renderItem={({item}) => (
                    <ImageComponent 
                    onPress={()=>{confirm ? onPress(item) : {}}}
                    uri={item}
                    selected={selected.some(x=>x===item) && confirm}
                   />
                    )}
                />
            )}
        </View>
    )
}