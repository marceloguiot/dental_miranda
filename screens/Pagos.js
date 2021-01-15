import {Text, View, ScrollView, Modal, TouchableOpacity, TouchableHighlight, TextInput, Alert} from 'react-native';
import React, {useState, useEffect} from 'react';
import firebase from 'firebase';
import { Agenda, LocaleConfig} from 'react-native-calendars'
import {Card} from 'react-native-paper';
import RadioButtonRN from 'radio-buttons-react-native';
import { render } from 'react-dom';





LocaleConfig.locales['Es'] = {
  monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  monthNamesShort: ['Ene.','Feb.','Marzo','Abril','Mayo','Junio','Julio','Agost.','Sept.','Oct.','Nov.','Dec.'],
  dayNames: ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
  dayNamesShort: ['Dom.','Lun.','Mar.','Mie.','Jue.','Vie.','Sab.']
};

LocaleConfig.defaultLocale = 'Es';

const timeToString = (time) => {
  const date = new Date(time);
  return date.toISOString().split('T')[0];
};

export default function Pagos({navigation})
{
  const [items, setItems] = useState({});
  const [cita, setcita] = useState("");
  const [desglose, setdesglose] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [realizada, setrealizada] = useState("");
  const [Procedimiento, setprocedimiento] = useState("");
  const [abono, setabono] = useState("");
  const [cantidad, setcantidad] = useState("");
  const [viewdesgloce, setviewdesgloce] = useState('flex');
  const [viewdesgloce1, setviewdesgloce1] = useState('none');
  const [Actual, setActual] = useState("");
  const [update, setupdate] = useState(false);
  const [nkey, setnkey] = useState(1);
  
  useEffect(() => {
    let id = firebase.auth().currentUser;
     
    if(id === null)
    {
      Alert.alert('Alerta','Inicie sesión para continuar.');
      navigation.navigate('Home');
    }
  },[])




  const data = [
    {
      label: 'Si'
     },
     {
      label: 'No'
     }
    ];
    
    
  


  const loadItems = (day) => {
    let unformat = day.timestamp;
   for (let i = -15; i < 85; i++) {
    const time = unformat + i * 24 * 60 * 60 * 1000;
     // const time = day.timestamp;
      const strTime = timeToString(time);
     
      if (!items[strTime]) {
        items[strTime] = [];


        firebase.database().ref('consultas/'+ time).on("value", function(snapshot) {
          snapshot.val();
            const datos = snapshot.val();
            if(datos == null)
            {

            }
            else
            {
              
              if(time == datos.fecha)
              {
               

                items[strTime].push({
                  name: datos.nombre + ' ' + datos.apellidos + ' ' + datos.hora + ':' + datos.minuto,
                  fecha: datos.fecha,
                  realizada: datos.realizada,
                 });
              }
            }
            
      });


          
          
      
   
        

     }
    }
    

      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
      
      
      
  };

  const renderItem = (item) => {
    return (
     
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                
              }}>
              <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity style={{marginRight: 10, marginTop: 17}} onPress = {() => {
                if(item.realizada == '0')
                {
                  setActual(item.fecha);
                  setModalVisible(!modalVisible);
                  
                }
                else
                {
                  Alert.alert('Aviso','Esta cita ya fue actualizada.');
                }
        
              }}>
              
              <Card>
          <Card.Content>
          
              
              <Text>{item.name}</Text>
              
      
           
          </Card.Content>
        </Card>
        </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => {
          if(item.realizada == '0')
          {
            Alert.alert(
              "Eliminar cita",
              "¿Esta seguro de eliminar esta cita?",
              [
            
                { text: "Confirmar", onPress: () => 
              
              {
                firebase.database().ref("consultas/"+item.fecha).remove();
                const strTime1 = timeToString(item.fecha);
                items[strTime1].splice(0,1);
                let newkey = nkey+1;
                setnkey(newkey);
               // Alert.alert('Aviso', 'Cita eliminada deslice hacia abajo la agenda para actualizar.');
                
  
             
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
          else
          {
            Alert.alert('Aviso','No puede eliminar una cita que ya fue actualizada.');
          }
          

      
      }}><Text style={{marginTop:15}}>Eliminar</Text></TouchableOpacity>
            </View>
  
      
    );
    
  };

return (
    <View style={{flex: 1}}>
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={renderItem}
      refreshing={update}
      onRefresh={ () => setupdate(true), () => {loadItems; setupdate(false); renderItem; renderItem}}
      key={nkey}
    />

<Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
<View style={{flex:1, justifyContent:'center', alignItems: 'center', marginTop: 14}}>
<View style={{  margin: 20, backgroundColor: "white", borderRadius: 20, padding: 25, alignItems: "center"}}>
<Text style={{fontWeight:"700"}}>Reporte de cita</Text>

<Text style={{marginTop:30, fontWeight:"700"}}>La cita fue realizada:</Text>
<RadioButtonRN
      style={{width: 150, height: 50, marginLeft: 90}}
      data={data}
      box={false}
      selectedBtn={(e) => {setrealizada(e.label); if(e.label == 'No'){
        setviewdesgloce('none');
      }
    else
  {
    setviewdesgloce('flex');
    setviewdesgloce1('none');
  }}}
    />

<Text style={{marginTop:40, fontWeight:"700", display:viewdesgloce}}>Procedimiento realizado:</Text>
<TextInput
      style={{ height: 60, width: 250, borderColor: 'gray', borderWidth: 1, marginTop: 15, padding: 5, display:viewdesgloce }}
      onChangeText={Procedimiento => setprocedimiento(Procedimiento)}
    />
<Text style={{marginTop:40, fontWeight:"700", display:viewdesgloce}}>¿Se abono al tratamiento?:</Text>
<RadioButtonRN
      style={{width: 150, height: 70, marginLeft: 90, display:viewdesgloce}}
      data={data}
      box={false}
      selectedBtn={(e) => {setabono(e.label); if(e.label == 'No'){
        setviewdesgloce1('none');
      }
    else
  {
    setviewdesgloce1('flex');
  }}}
    />
<TextInput
placeholder='Cantidad'
      style={{ height: 40, width: 250, borderColor: 'gray', borderWidth: 1, marginTop: 15, padding: 5, display:viewdesgloce1 }}
      onChangeText={cantidad => setcantidad(cantidad)}
      keyboardType='number-pad'
      returnKeyLabel='Ok'
      returnKeyType='done'
      
    />
<View style={{display:'flex', flexDirection: 'row', marginTop: 30, alignItems:'space-between'}}>

           <Text style={{flex: 6, color:'#137081'}} onPress={() => {
          if(realizada.trim() == '')
          {
          Alert.alert('Alerta','Indique si la cita fue realizada.');
          }
          else if(Procedimiento.trim() == '')
          {
            Alert.alert('Alerta','Especifique el procedimiento realizado en la cita.');
          }
          else if(abono == '')
          {
            Alert.alert('Alerta','Indique si se realizó abono al tratamiento.');
          }
          else if(abono == 'Si' && cantidad.trim() == '')
          {
            Alert.alert('Alerta','Especifique la cantidad abonada.');
          }
          else
          {
            const strTime1 = timeToString(Actual);
            items[strTime1].splice(0,1);
            Alert.alert('Aviso','La cita fue actualizada correctamente.',[{
              text: 'Aceptar', onPress: () => {
                setModalVisible(!modalVisible);
              }
            },
            {
              text: "Cancelar",
              style: "cancel"
            }]);
            
            firebase.database().ref("consultas/"+Actual).update({
              realizada: realizada,
              procedimiento: Procedimiento,
              abono: abono,
              cantidad: cantidad,
            });

          
            
            
            
          }
            
           }}>Guardar</Text>

            <TouchableHighlight
              onPress={() => {
                setModalVisible(!modalVisible);
                setviewdesgloce('flex');
              }}
            >
              <Text style={{flex: 6}}>Cerrar</Text>
            </TouchableHighlight>
            </View>
  </View>
</View>


      </Modal>
  </View>

  
    );


}