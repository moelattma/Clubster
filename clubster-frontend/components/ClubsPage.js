import React from 'react';
import { TouchableOpacity,  
  StyleSheet, 
  Text, 
  View, 
   } from 'react-native';


export default class Boxes extends React.Component {
  
  render() {
    return (
        // Container for the whole body
        <View style={styles.body}>
            <Text style={styles.header}>
             Clubs
            </Text>

            {/* Using Flexbox 1 to align box 1 and 2 in same row
            which takes 2/3 of the main body */}
            <View style={styles.flexBox1}>      
                <TouchableOpacity style={styles.button1}>
                    <Text style={styles.clubName}>
                        Club 1
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button2}>
                    <Text style={styles.clubName}>
                        Club2
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Using flexBox2 to align box3 and 4 in second row 
            which takes 2/3 of the main body */}
            <View style={styles.flexBox2} >
                <TouchableOpacity style={styles.button3}>
                    <Text style={styles.clubName}>
                        Club3
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button4}>
                    <Text style={styles.clubName}>
                        Club4
                    </Text>
                </TouchableOpacity>

            </View>

            {/* Using flexBox3 to use to align the bottom row 
            which takes 1/3 of the body */}
            <View style={styles.flexBox3}>

                <TouchableOpacity>
                    <Text style={styles.insideText}>
                        Notification
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.insideText}>
                        People
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                    <Text style={styles.insideText}>
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={{alignSelf: 'flex-end', color: 'white', fontStyle: 'italic'}}>
                  Powered by CLUBSTER
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    body : {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#36485f',
        alignItems: 'stretch',
    },
    header: {
        color : 'white', 
        fontWeight: 'bold', 
        fontSize: 50,
        fontStyle: 'italic',
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexBox1: {
        flex: 3,
        height: 10,
        alignItems: 'center',
        backgroundColor: '#6699cc',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    flexBox2: {
        flex: 3,
        height: 10,
        alignItems: 'center',
        backgroundColor: '#6699cc',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    flexBox3: {
        flex: 1,
        borderWidth: 1,
        height: 10,
        alignItems: 'center',
        backgroundColor: '#9fbfdf',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button1: {
        height: 150,
        width: 150,
        marginLeft: 10,
        marginTop: 80,
        marginBottom: 100,
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#80ffcc',
    },
    button2: {
        height: 150,
        width: 150,
        marginLeft: 10,
        marginTop: 80,
        marginBottom: 100, 
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#df80ff',  
    },
    button3: {
        height: 150,
        width: 150,
        marginBottom: 20,
        marginTop: 30,
        marginLeft: 10,
        backgroundColor: '#ff8080',
        alignSelf: 'stretch',
        justifyContent: 'center',
        
    },
    button4: {
        height: 150,
        width: 150,
        marginBottom: 20,
        marginTop: 30,
        marginLeft: 10,
        alignSelf: 'stretch',
        justifyContent: 'center',
        backgroundColor: '#ffff80',
    },

    clubName:{
        fontSize: 40,
        color: 'black',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    insideText: {
        fontSize: 20,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
});