import * as WebBrowser from 'expo-web-browser';
import React, {useState, useEffect, useRef} from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Button, View, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import firebase from 'firebase';
import styled from 'styled-components';







const firebaseConfig = {
  apiKey: "AIzaSyD2DxRNnzi-K4ErJNTbxNJ4PO1d5m6Ist8",
  authDomain: "dental-miranda.firebaseapp.com",
  databaseURL: "https://dental-miranda.firebaseio.com",
  projectId: "dental-miranda",
  storageBucket: "dental-miranda.appspot.com",
  messagingSenderId: "378806989175",
  appId: "1:378806989175:web:50d240c88516c067227172"
};

firebase.initializeApp(firebaseConfig);

export default function HomeScreen({navigation}) {
  const [sesion , setsesion] = useState(false);
  const [usuario, setusuario] = useState('');
  const [pass, setpass] = useState('');
  const [nombre, setnombre] = useState('');
  const [apellidos, setapellidos] = useState('');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  



  firebase.auth().onAuthStateChanged((user) => user ? setsesion(true) : setsesion(false));
  let id = firebase.auth().currentUser;
 

  
  if(sesion == true)
  {

    firebase.database().ref('pacientes/'+id.uid).once('value').then(
      (snapshot) => { setnombre(snapshot.val().nombre); setapellidos(snapshot.val().apellidos)}
    
   );
   
    return (
      <View style={styles.container}>
      <Fondo source = {require('../assets/images/dentist.jpg')}>
      <Text style={styles.getStartedText}>Dental Miranda</Text>
      </Fondo>
      <View style={{alignItems: 'center'}}>
      <Text style={styles.regulartext}>Sesión iniciada</Text>
      <Text style={styles.regulartext}>{nombre} {apellidos}</Text>
     <Button title="Cerrar sesión" onPress={() => {
      firebase.auth().signOut();
      setapellidos('');
      setnombre('');
      setusuario('');
      setpass('');
     }}></Button>
      </View>
      </View>
     
    );
  }
  else
  {
    
    return (
      <View style={styles.container}>
      <Fondo source = {require('../assets/images/dentist.jpg')}>
       <Text style={styles.getStartedText}>Dental Miranda</Text>
       </Fondo>
      <View style={{alignItems: 'center'}}>
      <Text style={styles.regulartext}>{sesion}</Text>
      <TextInput style={styles.inputs} placeholder='Correo electrónico'
      onChangeText={usuario => setusuario(usuario)}></TextInput>
      </View>
      <View style={{alignItems: 'center'}}>
      <TextInput style={styles.inputs} placeholder='Contraseña'
      onChangeText={pass => setpass(pass)} secureTextEntry={true}></TextInput>
     

 

      <Acceso onPress={ () => { if(usuario == '' || pass == '')
      {
        Alert.alert('Aviso','Ingrese correo electrónico y contraseña para iniciar sesión.',[
          {
            text: "Aceptar",
            style: "cancel"
          } 
        ],{ cancelable: false });
      }
      else
      {
      firebase.auth().signInWithEmailAndPassword(usuario,pass).catch(err => {
        if(err.message == 'The email address is badly formatted.')
        {
          Alert.alert('Alerta','El formato de correo electrónico es incorrecto.');
        }
        else if(err.message == 'There is no user record corresponding to this identifier. The user may have been deleted.')
        {
          Alert.alert('Alerta','El usuario o contraseña es incorrecto.');
        }
        else if(err.message == 'The password is invalid or the user does not have a password.'){
          Alert.alert('Alerta','El usuario o contraseña es incorrecto.');
        }
        else{
          Alert.alert('Alerta','No se ha podido conectar intente más tarde.');
        }
      })
      }}}>
      <Text style={{fontSize: 25, color: '#FFFFFF', fontWeight: '600', marginTop: -50}}>Iniciar sesión</Text>
      </Acceso>
      </View>
     
      </View>
     
    );
  }

}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}





const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  getStartedText: {
    fontSize: 47,
    color: '#FFFFFF',
    fontWeight: "bold",
    textAlign: 'center',
    alignItems: 'center',
    marginTop: '43%',
  },
  regulartext:{
    fontSize:18,
    textAlign: 'center',
    marginTop: 15,
    padding: 10,
  },
  inputs:{
    width: 300,
    fontSize: 16,
    backgroundColor: '#E7EEF1',
    marginTop: 20,
    height: 35,
    padding: 10,
  },
});


const Acceso = styled.TouchableOpacity`
margin: 20%;
width: 250px;
height: 45px;
align-items:center;
justify-content: center;
background-color: #3D809C;
border-radius: 4px;
`;

const Fondo = styled.ImageBackground`
width: 100%;
height: 40%;
align-items:center;

`;