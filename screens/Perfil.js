import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, TouchableHighlight, Button} from 'react-native';
import firebase from 'firebase';
import {List, DataTable} from 'react-native-paper';
import styled from 'styled-components';
import {Modal, Alert} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars'
import RadioButtonRN from 'radio-buttons-react-native';
import TimePicker from 'react-native-simple-time-picker';

export default function Perfil({navigation})
{
    const [conectado, setconectado] = useState('');
    const [nombre, setnombre] = useState('');
    const [apellidos, setapellidos] = useState('');
    const [email, setemail] = useState('');
    const [edad, setedad] = useState('');
    const [sexo, setsexo] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [expanded1, setExpanded1] = useState(false);
    const [pacientes, setpacientes] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modaledit, setmodaledit] = useState(false);
    const [id, setid] = useState("");
    const [viewcalendar,setviewcalendar] = useState("flex");
    const [viewdata,setviewdata] = useState("");
    const [viewdatafull,setviewdatafull] = useState("none");
    const [hour, sethour] = useState("9");
    const [minutes, setminutes] = useState("15"); 
    const [historico, sethistorico] = useState("");
  
    const [dnombre, setdnombre] = useState("Marcelo Antonio");
    const [dapellidos, setdapellidos] = useState("Guiot Santiago");
    const [dedad, setdedad] = useState("30");
    const [dtratamiento, setdtratamiento] = useState("Ninguno");
    const [dcosto, setdcosto] = useState("3000");
    const [tratamiento, settratamiento] = useState("");
    const [costo, setcosto] = useState("");

    const data = [
      {
        label: 'Hombre'
       },
       {
        label: 'Mujer'
       }
      ];
    

    const handlePress = () => setExpanded(!expanded);
    const handlePress1 = () => setExpanded1(!expanded1);

    useEffect(() => {

  
        let id = firebase.auth().currentUser;
     
      if(id === null)
      {
        Alert.alert('Alerta','Inicie sesión para continuar.');
        navigation.navigate('Home');
      }
        
        
    
    
        firebase.database().ref('pacientes/').once("value", function(snapshot) {
        snapshot.val();
           setpacientes(snapshot.val());
           
            
          });

    }, []);

    useEffect(() => {
      if(expanded == true)
      {
        setviewdatafull('none');
      }
    }, [expanded])

    useEffect(() => {
      if(expanded1 == false)
      {
        setviewdatafull('none');
      }
    }, [expanded1])


  
  const desplegar = () =>
  {
      setModalVisible(!modalVisible);
  }

  const desplegarfull = (nombre, apellidos, tratamiento, costo, id, edad) =>
  {
    setid(id);
    setdnombre(nombre);
    setdapellidos(apellidos);
    setdedad(edad);
    setdtratamiento(tratamiento);
    setdcosto(costo);
    setviewdatafull('flex');
    let datafull = firebase.database().ref("/consultas").orderByChild('id').equalTo(id).once("value", function(snapshot){
      
      if(snapshot.val() == null || snapshot.val() == 'undefined')
      {
       
      }
      else
      {
        const rebels = Object.values(snapshot.val()).filter(pilot => pilot.realizada === "Si");
        const rebels1 = Object.assign({},rebels);
        sethistorico(rebels1);
      }



    });


    

  }

  const eliminar = (id) =>
  {
    Alert.alert(
      "Eliminar paciente",
      "¿Esta seguro de eliminar este paciente?",
      [
    
        { text: "Confirmar", onPress: () => 
      
      {
    
        firebase.database().ref("pacientes/"+id).remove();
        firebase.database().ref('pacientes/').once("value", function(snapshot) {
          snapshot.val();
             setpacientes(snapshot.val());
             setviewdatafull('none');
      });

      Alert.alert('Aviso', 'Paciente eliminado.',
      [
        {
          text: "Aceptar",
          style: "cancel"
        } 
      ],{ cancelable: false });
    
     
      }
    },
    {
      text: "Cancelar",
      style: "cancel"
    }
      ],
      { cancelable: false }
    );


  }



      const element = (index) => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View >
            <Text>Mostrar</Text>
          </View>
        </TouchableOpacity>
      );

    
    return(
    <ScrollView>
    
    <List.Section >
    <List.Accordion
    title="Registrar pacientes"
    left={props => <List.Icon {...props} icon="account-plus" />}
    expanded={expanded}
    onPress={handlePress}>

    <View style={{marginTop:20, marginLeft:-40,}}>
    <TextInput style={estilo.input} placeholder='Nombre(s)' onChangeText={nombre => setnombre(nombre)}></TextInput>
    <TextInput style={estilo.input} placeholder='Apellidos' onChangeText={apellidos => setapellidos(apellidos)}></TextInput>
    </View>

    <View style={{marginLeft:-40,}}>
    <TextInput style={estilo.input} placeholder='Email'
    onChangeText={email => setemail(email)}></TextInput>
 

    <TextInput style={estilo.input} placeholder='Edad'
    onChangeText={edad => setedad(edad)} keyboardType='number-pad'
    returnKeyLabel='Ok'
    returnKeyType='done'></TextInput>
   <RadioButtonRN
      style={{width: 170, height: 70}}
      data={data}
      box={false}
      selectedBtn={(e) => setsexo(e.label)}
    />
    </View>
    <View style={{marginLeft:-40, marginTop:15}}>
      <TextInput style={estilo.input}
 placeholder='Tratamiento' onChangeText={tratamiento => settratamiento(tratamiento)}></TextInput>
 </View>
 <View style={{marginLeft:-40, marginTop:15}}>
      <TextInput style={estilo.input}
 placeholder='Costo total del tratamiento' onChangeText={costo => setcosto(costo)} keyboardType='number-pad'
 returnKeyLabel='Ok'
 returnKeyType='done'></TextInput>
 </View>

    <View>

    <Acceso style={{marginLeft: 0}} onPress ={ () => {

        if(apellidos.trim() == '')
        {
            alert('Ingrese los apellidos del paciente.');
        }
        else if(nombre.trim() == '')
        {
            alert('Ingrese el nombre del paciente.');
        }
        else if(email.trim() == '')
        {
            alert('Ingrese el email del paciente');
        }
        else if(edad.trim() == '')
        {
            alert('Ingrese la edad del paciente');
        }
        else if(sexo.trim() == '')
        {
            alert('Ingrese el sexo del paciente');
        }
        else if(tratamiento.trim() == '')
        {
            alert('Ingrese el tratamiento del paciente');
        }
        else if(costo.trim() == '')
        {
            alert('Ingrese el costo total del tratamiento');
        }
        else
        {
            var newPostKey = firebase.database().ref().child('pacientes/').push().key;
            firebase.database().ref("pacientes/").child(newPostKey).set({id: newPostKey,
                nombre: nombre,
                apellidos: apellidos,
                email: email,
                edad: edad,
                sexo: sexo,
                tratamiento: tratamiento,
                costo: costo});

                firebase.database().ref('pacientes/').once("value", function(snapshot) {
                    snapshot.val();
                       setpacientes(snapshot.val());
                });
            alert('Paciente guardado correctamente');
            setExpanded(!expanded);

        }

    }}>
    
    <Text style={{fontSize: 25, color: '#FFFFFF', fontWeight: '600', marginTop: -50}}>Guardar</Text>
    </Acceso>
    
    </View>
    
  </List.Accordion>
  <List.Accordion
    title="Ver pacientes"
    left={props => <List.Icon {...props} icon="account-card-details" />}
    expanded={expanded1}
    onPress={handlePress1}>

  

    <DataTable style={{paddingLeft:0}}>
    <DataTable.Header>
      <DataTable.Title>Nombre</DataTable.Title>
      <DataTable.Title>Apellidos</DataTable.Title>
      <DataTable.Title style={{alignContent: 'center'}}>Opciones</DataTable.Title>
    </DataTable.Header>


    
    {Object.values(pacientes).map((list)=> <DataTable.Row key={list.id}><DataTable.Cell>{list.nombre}</DataTable.Cell><DataTable.Cell>{list.apellidos}</DataTable.Cell><DataTable.Cell ><Text style={{color:'#137081'}} onPress={() => {desplegarfull(list.nombre, list.apellidos, list.tratamiento, list.costo, list.id, list.edad)} }>Mostrar</Text>  <Text style={{color: '#CD5C5C'}} onPress={() => {eliminar(list.id)} }>Eliminar</Text></DataTable.Cell></DataTable.Row>)}
    
    <DataTable.Pagination
      page={1}
      numberOfPages={3}
      onPageChange={page => {
        
      }}
      label=""
    />
  </DataTable>

    
    </List.Accordion>
</List.Section>


<Modal
        
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          alert('Ventana cerrada.');
          
        }}
      >
      <ScrollView>
        <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
          <View style={{ backgroundColor: "white", borderRadius: 20, padding: 10, margin:15, alignItems: "center"}}>


              <View style={estilo.title1}><Text style={{fontSize:16}}>Seleccione hora y fecha para cita:</Text></View>
    <TimePicker
          selectedHours={9}
          selectedMinutes={15}
          onChange={(hora, minutos) => { sethour(hora); setminutes(minutos)}}
        />

        <CalendarList horizontal={true} monthFormat={'MMM yyyy'} onDayPress={(day) => {

          if(hour == '' || minutes == '')
          {
            Alert.alert('Alerta','Seleccione la hora de la cita para continuar.');
          }
          else
          {
     Alert.alert(
      "Confirmar cita",
      "¿Esta seguro de programar esta cita?",
      [
    
        { text: "Confirmar", onPress: () => 
      
      {
    
       let nh = (hour*60*60)*1000;
       let mh = (minutes*60)*1000;
       let total = nh + mh;
       let timestampf = day.timestamp + total;
    
        firebase.database().ref("consultas/").child(day.timestamp).set({id: id,
          fecha: day.timestamp,
        fechafull: timestampf,
        fechatext: day.dateString,
        hora: hour,
        minuto: minutes, 
      nombre: dnombre,
      apellidos: dapellidos,
    realizada: '0'});
      Alert.alert('Aviso', 'Su cita ha sido programada.',
      [
        {
          text: "Aceptar",
          style: "cancel", onPress: () => {
            setModalVisible(!modalVisible);
          }
        } 
      ],{ cancelable: false });
    
    
      }
    },
    {
      text: "Cancelar",
      style: "cancel"
    }
      ],
      { cancelable: false }
    );
          }
    
    
        }} style={{marginBottom: -50}}>
        </CalendarList>

    <TouchableHighlight
    onPress={() => {
      setModalVisible(!modalVisible);
    }}
    style={{marginBottom:-250}}
  >
    <Text style={{fontSize:16}}>Cerrar</Text>
  </TouchableHighlight>
        
           
    
          
         
        
    </View>
            
        </View>
        </ScrollView>
      </Modal>

     
      <Modal
        
      animationType="slide"
      transparent={true}
      visible={modaledit}
      onRequestClose={() => {
        alert('Ventana cerrada.');
        
      }}
    >
      <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
      <View style={{ backgroundColor: "white", borderRadius: 20, padding: 10, margin:15, alignItems: "center"}}>
      <View style={estilo.title1}><Text style={{fontSize:16, fontWeight:'700'}}>Editar participante:</Text></View>
      <View style={{display:'flex', flexDirection:'column', marginTop: 25}}>
      <View style={{display:'flex', flexDirection:'row'}}>
      <Text style={{fontWeight:'700', width:120}}>Nombre:</Text>
      <TextInput style={{width:150, backgroundColor: '#C9C9C9', paddingLeft: 5}} value={dnombre} onChangeText={(nuevon) => {setdnombre(nuevon)}}></TextInput>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginTop: 20}}>
      <Text style={{fontWeight:'700', width:120}}>Apellidos:</Text>
      <TextInput style={{width:150, backgroundColor: '#C9C9C9', paddingLeft: 5}} value={dapellidos} onChangeText={(nuevoa) => {setdapellidos(nuevoa)}}></TextInput>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginTop: 20}}>
      <Text style={{fontWeight:'700', width:120}}>Edad:</Text>
      <TextInput style={{width:150, backgroundColor: '#C9C9C9', paddingLeft: 5}} value={dedad} onChangeText={(nuevoe) => {setdedad(nuevoe)}} keyboardType='number-pad' returnKeyLabel='Ok'
      returnKeyType='done'></TextInput>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginTop: 20}}>
      <Text style={{fontWeight:'700', width:120}}>Tratamiento:</Text>
      <TextInput style={{width:150, backgroundColor: '#C9C9C9', paddingLeft: 5}} value={dtratamiento} onChangeText={(nuevot) => {setdtratamiento(nuevot)}}></TextInput>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginTop: 20}}>
      <Text style={{fontWeight:'700', width:120}}>Costo del tratamiento:</Text>
      <TextInput style={{width:150, backgroundColor: '#C9C9C9', paddingLeft: 5}} value={dcosto} onChangeText={(nuevoc) => {setdcosto(nuevoc)}} keyboardType='number-pad' returnKeyLabel='Ok'
      returnKeyType='done'></TextInput>
      </View>
      
      
      </View>
      
      
      <View style={{display: 'flex', flexDirection:'row', alignItems:'space-between', marginTop:25, padding:10}}>
      <Text style={{fontSize:16, flex:6}} onPress={() =>{

        firebase.database().ref("pacientes/"+id).set({id: id,
          nombre: dnombre,
          apellidos: dapellidos,
          edad: dedad,
          tratamiento: dtratamiento,
          costo: dcosto});

          firebase.database().ref('pacientes/').once("value", function(snapshot) {
            snapshot.val();
               setpacientes(snapshot.val());
               setviewdatafull('none');
               
        }).then(()=>{
          Alert.alert('Aviso','El participante ha sido actualizado con exito.',
          [{text: 'Aceptar', onPress: ()=>{
            setmodaledit(!modaledit);

          }},
          {
            text: "Cancelar",
            style: "cancel"
          }]);

        });
  




      }}>Guardar</Text>
      <TouchableHighlight
      onPress={() => {
        setmodaledit(!modaledit);
      }}

      
      
    >
      <Text style={{fontSize:16, flex:6}}>Cerrar</Text>
    </TouchableHighlight>
    </View>
    </View></View></Modal>


      
      <View alignItems="center" style={{marginTop:5, display: viewdatafull}}>
      <Text style={{fontSize:20}}>Detalle del paciente</Text>
      </View>
      <View alignItems="flex-end" style={{marginTop:15, display: viewdatafull}}>
      <TouchableOpacity onPress={() =>{setmodaledit(!modaledit)}}><Text style={{color: '#137081', marginRight: 5}} >Editar paciente</Text></TouchableOpacity>
      </View>
      <View style={{padding:10, marginTop:15, display: viewdatafull, flexDirection:'column'}} >
      <View style={{display:'flex', flexDirection:'row', marginBottom: 20}}>
      <Text style={{width:90, marginRight: 10, fontWeight:'700'}}>Nombre:</Text>
      <Text>{dnombre}</Text>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginBottom: 20}}>
      <Text style={{width:90, marginRight: 10, fontWeight:'700'}}>Apellidos:</Text>
      <Text>{dapellidos}</Text>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginBottom: 20}}>
      <Text style={{width:90, marginRight: 10, fontWeight:'700'}}>Edad:</Text>
      <Text>{dedad}</Text>
      </View>

      <View style={{display:'flex', flexDirection:'row', marginBottom: 20}}>
      <Text style={{width:90, marginRight: 10, fontWeight:'700'}}>Tratamiento:</Text>
      <Text>{dtratamiento}</Text>
      </View>

      <View style={{display:'flex', flexDirection:'row', marginBottom: 20}}>
      <Text style={{width:90, marginRight: 10, fontWeight:'700'}}>Costo total:</Text>
      <Text>{dcosto}</Text>
      </View>
      <View alignItems="center" style={{marginTop:15, display: viewdatafull}}>
      <Text style={{fontSize:20}}>Historial de citas</Text>
      </View>
      <View alignItems="flex-end" style={{marginTop:15, display: viewdatafull}}>
      <TouchableOpacity onPress={desplegar} ><Text style={{color: '#137081'}}>Agendar cita</Text></TouchableOpacity>
      </View>
      <View style={{marginTop: 20}}>
      <DataTable>
      <DataTable.Header>
      <DataTable.Title>Procedimiento</DataTable.Title>
      <DataTable.Title>Fecha</DataTable.Title>
      <DataTable.Title>Abonó</DataTable.Title>
      
    </DataTable.Header>
    </DataTable>
      {

       
        Object.values(historico).map((list)=>
         
  
            <DataTable.Row key={list.fechafull}><DataTable.Cell>{list.procedimiento}</DataTable.Cell><DataTable.Cell>{list.fechatext}</DataTable.Cell><DataTable.Cell>{list.cantidad}</DataTable.Cell></DataTable.Row>
      
          
          
      )}
      </View>
      </View>
      

    </ScrollView>
);
}

const estilo = StyleSheet.create(
{ 
  title1: {
  alignItems: 'center',
  marginTop: 20,
  fontSize: 20,
  },
    regulartext: {
        fontSize: 14,
        padding: 15,
    },
    titletext: {
        fontSize: 16,
        padding: 15,
    },
    input : {
            width: "95%",
            height: 45,
            padding: 10,
            backgroundColor: 'white',
            marginBottom: 12,
    },
    vista: {
        alignItems: 'center',
    },
}
);

const Acceso = styled.TouchableOpacity`
margin: 15%;
width: 250px;
height: 45px;
align-items:center;
justify-content: center;
background-color: #3D809C;
border-radius: 4px;
`;