import * as React from 'react';
import {Text, View, ScrollView, StyleSheet} from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars'

export default function Agenda1()
{
return(
    <ScrollView>
    <View style={estilo.title}><Text style={{fontSize:16}}>Seleccione fecha para cita:</Text></View>
    <View style={{marginTop:25}}>
    <CalendarList horizontal={true} monthFormat={'MMM yyyy'} onDayPress={(day) => {alert(day.dateString)}}>
    </CalendarList>
    </View>
    </ScrollView>
);
}



const estilo = StyleSheet.create(
{
    title: {
        alignItems: 'center',
        marginTop: 20,
        fontSize: 20,
    },
});