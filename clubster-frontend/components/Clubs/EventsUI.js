import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';

const EventsUI = ({events}) => (

    <View style={styles.screen}>
        <View>
            <ScrollView vertical>
                {events.map((event, i) => (

                    <View key={i} style={styles.eventCard}>

                        <View style={styles.content}>
                            <View style={styles.eventDetails}>
                                <Text style={styles.eventName}>
                                    {event.name}
                                </Text>
                                <Text>{event.date}</Text>
                                <Text>{event.time}</Text>

                            </View>

                            <View style={styles.eventImage}>
                                <Image style={{width: 100, height: 70}} source={{uri: 'data:image/png;base64,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'}}/>
                            </View>

                        </View>
                        <View>
                            <Text>{event.description}</Text>
                        </View>
                    </View>

                ))}

            </ScrollView>
        </View>
    </View>


);

const styles = StyleSheet.create({

    content: {
        flexDirection: 'row'
    },

    screen:{
        paddingHorizontal: 5
    },
    eventCard: {
        flex: 1,
        backgroundColor: 'lavender',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginVertical: 2.5

    },

    header: {
        fontSize:25,
        backgroundColor: 'lightgrey',
        paddingLeft: 5,
        marginBottom: 2.75
    },

    eventImage: {
        flex: .5,
        alignItems: 'flex-end'
    },
    eventDetails: {
        flex: 1.25
    },
    eventName: {
        fontSize: 20
    }
});

export default EventsUI;
